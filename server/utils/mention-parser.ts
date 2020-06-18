const parseMentions = (str: string = ""): string[] => {
  const MENTION_REGEX = /(?:^|[^a-zA-Z0-9-＠!@#$%&*])(?:(?:@|＠)(?!\/))([a-zA-Z0-9\/-]{1,20})(?:\b(?!@|＠)|$)/gim;
  let mentions = str.match(MENTION_REGEX) || [];
  mentions = mentions.map(m => m.replace(" @", ""));

  return mentions;
};

export default parseMentions;
