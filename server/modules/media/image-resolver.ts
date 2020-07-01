import "reflect-metadata";
import { GraphQLUpload } from "apollo-server-express";
import { Resolver, Arg, Mutation, Field, ObjectType, UseMiddleware } from 'type-graphql';
import { Stream } from "stream";
import { v2 as cloudinary } from 'cloudinary'
import RateLimit from "../rate-limiter-middleware";

@ObjectType()
class UploadImageOutput {
  @Field()
  url!: string

  @Field()
  public_id!: string
}

interface IUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
  stream: Stream;
}
@Resolver()
class ImageResolver {
  @UseMiddleware(RateLimit({ limit: 10 }))
  @Mutation(() => UploadImageOutput)
  async uploadImage(@Arg('file', () => GraphQLUpload) file: Promise<IUpload>): Promise<UploadImageOutput> {
    const { createReadStream } = await file;
    const fileStream = createReadStream();

    return new Promise((resolve, reject) => {
      const cloudStream = cloudinary.uploader.upload_stream({
        unique_filename: true,
        folder: process.env.MEDIA_FOLDER
      }, (err, fileUploaded) => {
        if (err) reject(false);

        resolve({
          url: fileUploaded.secure_url,
          public_id: fileUploaded.public_id
        });
      })

      fileStream.pipe(cloudStream)
    })
  }
}


export default ImageResolver;