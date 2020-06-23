import { Router } from "express";
import crypto from "crypto"
import safeCompare from "safe-compare";
import Bot from "./BotSDK";
const route = Router()
import { ObjectID } from "mongodb";
import GithubBot from "./GithubBot";

function sign(data: any) {
  return `sha1=${crypto.createHmac('sha1', process.env.WEBHOOK_SECRET).update(data).digest('hex')}`
}
function verify(signature: any, data: any) {
  const sig = Buffer.from(signature)
  const signed = Buffer.from(sign(data))
  if (sig.length !== signed.length) {
    return false
  }
  console.log(sig, signed)
  return crypto.timingSafeEqual(sig, signed)
}


route.post("/:roomId/github", async (req, res) => {
  const roomId = req.param('roomId');
  const isAllowed = verify(req.get('x-hub-signature'), JSON.stringify(req.body));
  if (!isAllowed) return res.end('not allowed');
  // const isMaster = body?.ref === 'refs/heads/master';

  // init instance
  const githubBot = new GithubBot({
    name: 'Github Bot',
    avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  });
  // build schema
  await githubBot.initSchema();

  // upsert on room
  await githubBot.installOnRoom(new ObjectID(roomId));

  // do stuff
  githubBot.doActions(req.body.action, req.body);

  res.end('ok');
});


export default route;