import {
  IsUrl,
  Length,
  Matches,
  IsHexColor,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import {
  isColorTooDark,
  youtubeChannelRegEx,
  githubUsernameRegex,
  twitterUsernameRegex,
} from '../../utils'
import { Validate } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ValidatorConstraint({ name: "validateColor", async: false })
class ValidateColor implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return !isColorTooDark(text);
  }

  defaultMessage(args: ValidationArguments) {
    return "Color value ($value) is too dark";
  }
}

@ArgsType()
export class setColorArgs {
  @Field({ nullable: false })
  @IsHexColor()
  @Validate(ValidateColor)
  color: string;
}

@ArgsType()
export class setUserLinksArgs {
  @Field({ nullable: true })
  @Length(5, 100)
  @Matches(githubUsernameRegex, { message: "Invalid Github username" })
  public github?: string

  @Field({ nullable: true })
  @Length(5, 100)
  @Matches(twitterUsernameRegex, { message: "Invalid Twitter username" })
  public twitter?: string

  @Field({ nullable: true })
  @Matches(youtubeChannelRegEx, { message: "Invalid Youtube channel/user Link" })
  @Length(5, 150)
  public youtube?: string

  @Field({ nullable: true })
  @Length(5, 100)
  @IsUrl({
    disallow_auth: true,
    allow_protocol_relative_urls: false
  }, { message: "Invalid website URL" })
  public website?: string
}