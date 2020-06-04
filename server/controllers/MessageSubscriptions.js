const { withFilter } = require("apollo-server-express");
const { NEW_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../constants");

const filterRoom = argName => (payload, variables) => {
  return payload[argName].roomId.toString() === variables.roomId;
};

const onNewMessage = {
  subscribe: withFilter((_parent, _args, context) => {
    return context.pubsub.asyncIterator([NEW_MESSAGE]);
  }, filterRoom("onNewMessage")),
};

const onDeleteMessage = {
  subscribe: withFilter((_parent, _args, context) => {
    return context.pubsub.asyncIterator([DELETE_MESSAGE]);
  }, filterRoom("onDeleteMessage")),
};

const onUpdateMessage = {
  subscribe: withFilter((_parent, _args, context) => {
    return context.pubsub.asyncIterator([UPDATE_MESSAGE]);
  }, filterRoom("onUpdateMessage")),
};

module.exports = {
  onNewMessage,
  onDeleteMessage,
  onUpdateMessage,
};
