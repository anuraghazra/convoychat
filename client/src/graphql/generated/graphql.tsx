import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Mongo object id scalar type */
  ObjectId: any;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type Query = {
  __typename?: 'Query';
  me: Me;
  listUsers: Array<Member>;
  getUser: User;
  getMessages: Messages;
  listRooms: Array<Room>;
  listCurrentUserRooms: Array<Room>;
  getRoom: Room;
  getNotifications: Array<Notification>;
  getInvitationInfo: InvitationDetails;
};


export type QueryGetUserArgs = {
  id: Scalars['ObjectId'];
};


export type QueryGetMessagesArgs = {
  roomId: Scalars['ObjectId'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetRoomArgs = {
  id: Scalars['ObjectId'];
};


export type QueryGetInvitationInfoArgs = {
  token: Scalars['String'];
};

export type Me = {
  __typename?: 'Me';
  id: Scalars['ObjectId'];
  name: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  avatarUrl: Scalars['String'];
  rooms: Array<Room>;
  color: Scalars['String'];
  links?: Maybe<UserLinks>;
};


export type Room = {
  __typename?: 'Room';
  id: Scalars['ObjectId'];
  createdAt: Scalars['DateTime'];
  name: Scalars['String'];
  members: Array<Member>;
  messages: Array<Message>;
  owner: Scalars['ObjectId'];
};


export type Member = {
  __typename?: 'Member';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  name: Scalars['String'];
  username: Scalars['String'];
  avatarUrl: Scalars['String'];
  rooms: Array<Scalars['ID']>;
  links?: Maybe<UserLinks>;
  color: Scalars['String'];
};

export type UserLinks = {
  __typename?: 'UserLinks';
  github?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  createdAt?: Maybe<Scalars['DateTime']>;
  roomId: Scalars['ID'];
  author: Member;
  content: Scalars['String'];
  mentions: Array<Scalars['ID']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ObjectId'];
  createdAt: Scalars['DateTime'];
  name: Scalars['String'];
  username: Scalars['String'];
  rooms: Array<Room>;
  color: Scalars['String'];
  links?: Maybe<UserLinks>;
};

export type Messages = {
  __typename?: 'Messages';
  totalDocs?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
  messages: Array<Message>;
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  sender: Member;
  receiver: Scalars['ID'];
  seen: Scalars['Boolean'];
  type: Notification_Type;
  payload: Scalars['JSONObject'];
};

/** Notification types enums */
export enum Notification_Type {
  Invitation = 'INVITATION',
  Mention = 'MENTION'
}


export type InvitationDetails = {
  __typename?: 'InvitationDetails';
  id: Scalars['ID'];
  room?: Maybe<Room>;
  invitedBy: Member;
  isPublic: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  setColor: Member;
  setUserLinks: Member;
  logout: Scalars['Boolean'];
  sendMessage: Message;
  deleteMessage: Message;
  editMessage: Message;
  createRoom: Room;
  deleteRoom?: Maybe<Room>;
  removeMemberFromRoom?: Maybe<Member>;
  readNotification: Notification;
  createInvitationLink: InvitationLinkResult;
  inviteMembers: Array<Invitation>;
  acceptInvitation: Scalars['Boolean'];
};


export type MutationSetColorArgs = {
  color: Scalars['String'];
};


export type MutationSetUserLinksArgs = {
  github?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};


export type MutationSendMessageArgs = {
  roomId: Scalars['ObjectId'];
  content: Scalars['String'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['ObjectId'];
};


export type MutationEditMessageArgs = {
  messageId: Scalars['ObjectId'];
  content: Scalars['String'];
};


export type MutationCreateRoomArgs = {
  name: Scalars['String'];
};


export type MutationDeleteRoomArgs = {
  roomId: Scalars['ObjectId'];
};


export type MutationRemoveMemberFromRoomArgs = {
  roomId: Scalars['ObjectId'];
  memberId: Scalars['ObjectId'];
};


export type MutationReadNotificationArgs = {
  id: Scalars['ObjectId'];
};


export type MutationCreateInvitationLinkArgs = {
  roomId: Scalars['ObjectId'];
};


export type MutationInviteMembersArgs = {
  roomId: Scalars['ObjectId'];
  members: Array<Scalars['ObjectId']>;
};


export type MutationAcceptInvitationArgs = {
  token: Scalars['String'];
};

export type InvitationLinkResult = {
  __typename?: 'InvitationLinkResult';
  link: Scalars['String'];
};

export type Invitation = {
  __typename?: 'Invitation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  invitedBy: Scalars['ID'];
  userId: Scalars['ID'];
  roomId: Scalars['ID'];
  isPublic: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onNewMessage: Message;
  onDeleteMessage: Message;
  onUpdateMessage: Message;
  onNewNotification: Notification;
};


export type SubscriptionOnNewMessageArgs = {
  roomId: Scalars['ObjectId'];
};


export type SubscriptionOnDeleteMessageArgs = {
  roomId: Scalars['ObjectId'];
};


export type SubscriptionOnUpdateMessageArgs = {
  roomId: Scalars['ObjectId'];
};

export type GetInvitationInfoQueryVariables = {
  token: Scalars['String'];
};


export type GetInvitationInfoQuery = (
  { __typename?: 'Query' }
  & { invitationInfo: (
    { __typename?: 'InvitationDetails' }
    & Pick<InvitationDetails, 'id' | 'createdAt' | 'isPublic'>
    & { room?: Maybe<(
      { __typename?: 'Room' }
      & Pick<Room, 'name' | 'id'>
    )>, invitedBy: (
      { __typename?: 'Member' }
      & Pick<Member, 'name'>
    ) }
  ) }
);

export type InviteMembersMutationVariables = {
  roomId: Scalars['ObjectId'];
  members: Array<Scalars['ObjectId']>;
};


export type InviteMembersMutation = (
  { __typename?: 'Mutation' }
  & { invitations: Array<(
    { __typename?: 'Invitation' }
    & Pick<Invitation, 'id' | 'roomId' | 'isPublic' | 'userId' | 'invitedBy' | 'createdAt'>
  )> }
);

export type CreateInvitationLinkMutationVariables = {
  roomId: Scalars['ObjectId'];
};


export type CreateInvitationLinkMutation = (
  { __typename?: 'Mutation' }
  & { invitation: (
    { __typename?: 'InvitationLinkResult' }
    & Pick<InvitationLinkResult, 'link'>
  ) }
);

export type AcceptInvitationMutationVariables = {
  token: Scalars['String'];
};


export type AcceptInvitationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'acceptInvitation'>
);

export type RoomMemberFragment = (
  { __typename?: 'Member' }
  & Pick<Member, 'id' | 'name' | 'username' | 'avatarUrl' | 'createdAt'>
);

export type GetRoomQueryVariables = {
  roomId: Scalars['ObjectId'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type GetRoomQuery = (
  { __typename?: 'Query' }
  & { room: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'owner' | 'createdAt'>
    & { members: Array<(
      { __typename?: 'Member' }
      & RoomMemberFragment
    )> }
  ), messages: (
    { __typename?: 'Messages' }
    & Pick<Messages, 'totalDocs' | 'totalPages'>
    & { messages: Array<(
      { __typename?: 'Message' }
      & Pick<Message, 'id' | 'roomId' | 'content' | 'createdAt' | 'mentions'>
      & { author: (
        { __typename?: 'Member' }
        & Pick<Member, 'id' | 'name' | 'username' | 'avatarUrl' | 'color'>
      ) }
    )> }
  ) }
);

export type RemoveMemberMutationVariables = {
  roomId: Scalars['ObjectId'];
  memberId: Scalars['ObjectId'];
};


export type RemoveMemberMutation = (
  { __typename?: 'Mutation' }
  & { removedMember?: Maybe<(
    { __typename?: 'Member' }
    & RoomMemberFragment
  )> }
);

export type CreateRoomMutationVariables = {
  name: Scalars['String'];
};


export type CreateRoomMutation = (
  { __typename?: 'Mutation' }
  & { newRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  ) }
);

export type DeleteRoomMutationVariables = {
  roomId: Scalars['ObjectId'];
};


export type DeleteRoomMutation = (
  { __typename?: 'Mutation' }
  & { deletedRoom?: Maybe<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  )> }
);

export type MessagePartsFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'roomId' | 'content' | 'createdAt' | 'mentions'>
  & { author: (
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'username'>
  ) }
);

export type SubscriptionMessagePartsFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'content' | 'roomId' | 'createdAt' | 'mentions'>
  & { author: (
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'name' | 'username' | 'avatarUrl' | 'color'>
  ) }
);

export type SendMessageMutationVariables = {
  roomId: Scalars['ObjectId'];
  content: Scalars['String'];
};


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & { sendMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'roomId' | 'content' | 'createdAt' | 'mentions'>
    & { author: (
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'name' | 'username' | 'avatarUrl' | 'color'>
    ) }
  ) }
);

export type DeleteMessageMutationVariables = {
  messageId: Scalars['ObjectId'];
};


export type DeleteMessageMutation = (
  { __typename?: 'Mutation' }
  & { deletedMessage: (
    { __typename?: 'Message' }
    & MessagePartsFragment
  ) }
);

export type EditMessageMutationVariables = {
  messageId: Scalars['ObjectId'];
  content: Scalars['String'];
};


export type EditMessageMutation = (
  { __typename?: 'Mutation' }
  & { editedMessage: (
    { __typename?: 'Message' }
    & MessagePartsFragment
  ) }
);

export type OnNewMessageSubscriptionVariables = {
  roomId: Scalars['ObjectId'];
};


export type OnNewMessageSubscription = (
  { __typename?: 'Subscription' }
  & { onNewMessage: (
    { __typename?: 'Message' }
    & SubscriptionMessagePartsFragment
  ) }
);

export type OnDeleteMessageSubscriptionVariables = {
  roomId: Scalars['ObjectId'];
};


export type OnDeleteMessageSubscription = (
  { __typename?: 'Subscription' }
  & { onDeleteMessage: (
    { __typename?: 'Message' }
    & SubscriptionMessagePartsFragment
  ) }
);

export type OnUpdateMessageSubscriptionVariables = {
  roomId: Scalars['ObjectId'];
};


export type OnUpdateMessageSubscription = (
  { __typename?: 'Subscription' }
  & { onUpdateMessage: (
    { __typename?: 'Message' }
    & SubscriptionMessagePartsFragment
  ) }
);

export type NotificationDataFragment = (
  { __typename?: 'Notification' }
  & Pick<Notification, 'id' | 'receiver' | 'seen' | 'type' | 'payload' | 'createdAt'>
  & { sender: (
    { __typename?: 'Member' }
    & Pick<Member, 'avatarUrl' | 'name'>
  ) }
);

export type CurrentUserQueryVariables = {};


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'Me' }
    & Pick<Me, 'id' | 'name' | 'email' | 'username' | 'avatarUrl' | 'color'>
    & { links?: Maybe<(
      { __typename?: 'UserLinks' }
      & Pick<UserLinks, 'github' | 'twitter' | 'instagram' | 'website'>
    )>, rooms: Array<(
      { __typename?: 'Room' }
      & Pick<Room, 'id' | 'name' | 'owner'>
    )> }
  ) }
);

export type ListUsersQueryVariables = {};


export type ListUsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'name' | 'avatarUrl' | 'username' | 'color' | 'rooms' | 'createdAt'>
    & { links?: Maybe<(
      { __typename?: 'UserLinks' }
      & Pick<UserLinks, 'github' | 'twitter' | 'instagram' | 'website'>
    )> }
  )> }
);

export type ListCurrentUserRoomsQueryVariables = {};


export type ListCurrentUserRoomsQuery = (
  { __typename?: 'Query' }
  & { currentUserRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  )> }
);

export type GetNotificationsQueryVariables = {};


export type GetNotificationsQuery = (
  { __typename?: 'Query' }
  & { notifications: Array<(
    { __typename?: 'Notification' }
    & NotificationDataFragment
  )> }
);

export type ReadNotificationMutationVariables = {
  id: Scalars['ObjectId'];
};


export type ReadNotificationMutation = (
  { __typename?: 'Mutation' }
  & { readNotification: (
    { __typename?: 'Notification' }
    & NotificationDataFragment
  ) }
);

export type SetUserColorMutationVariables = {
  color: Scalars['String'];
};


export type SetUserColorMutation = (
  { __typename?: 'Mutation' }
  & { setColor: (
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'color'>
  ) }
);

export type SetUserLinksMutationVariables = {
  github?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};


export type SetUserLinksMutation = (
  { __typename?: 'Mutation' }
  & { setUserLinks: (
    { __typename?: 'Member' }
    & Pick<Member, 'id'>
    & { links?: Maybe<(
      { __typename?: 'UserLinks' }
      & Pick<UserLinks, 'github' | 'twitter' | 'instagram' | 'website'>
    )> }
  ) }
);

export type SetUserSettingsMutationVariables = {
  color: Scalars['String'];
  github?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};


export type SetUserSettingsMutation = (
  { __typename?: 'Mutation' }
  & { setColor: (
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'color'>
  ), setUserLinks: (
    { __typename?: 'Member' }
    & Pick<Member, 'id'>
    & { links?: Maybe<(
      { __typename?: 'UserLinks' }
      & Pick<UserLinks, 'github' | 'twitter' | 'instagram' | 'website'>
    )> }
  ) }
);

export type OnNewNotificationSubscriptionVariables = {};


export type OnNewNotificationSubscription = (
  { __typename?: 'Subscription' }
  & { onNewNotification: (
    { __typename?: 'Notification' }
    & NotificationDataFragment
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export const RoomMemberFragmentDoc = gql`
    fragment RoomMember on Member {
  id
  name
  username
  avatarUrl
  createdAt
}
    `;
export const MessagePartsFragmentDoc = gql`
    fragment MessageParts on Message {
  id
  roomId
  content
  createdAt
  mentions
  author {
    id
    username
  }
}
    `;
export const SubscriptionMessagePartsFragmentDoc = gql`
    fragment SubscriptionMessageParts on Message {
  id
  content
  roomId
  createdAt
  mentions
  author {
    id
    name
    username
    avatarUrl
    color
  }
}
    `;
export const NotificationDataFragmentDoc = gql`
    fragment NotificationData on Notification {
  id
  receiver
  seen
  type
  payload
  createdAt
  sender {
    avatarUrl
    name
  }
}
    `;
export const GetInvitationInfoDocument = gql`
    query getInvitationInfo($token: String!) {
  invitationInfo: getInvitationInfo(token: $token) {
    id
    room {
      name
      id
    }
    invitedBy {
      name
    }
    createdAt
    isPublic
  }
}
    `;

/**
 * __useGetInvitationInfoQuery__
 *
 * To run a query within a React component, call `useGetInvitationInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvitationInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvitationInfoQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetInvitationInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetInvitationInfoQuery, GetInvitationInfoQueryVariables>) {
        return ApolloReactHooks.useQuery<GetInvitationInfoQuery, GetInvitationInfoQueryVariables>(GetInvitationInfoDocument, baseOptions);
      }
export function useGetInvitationInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInvitationInfoQuery, GetInvitationInfoQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetInvitationInfoQuery, GetInvitationInfoQueryVariables>(GetInvitationInfoDocument, baseOptions);
        }
export type GetInvitationInfoQueryHookResult = ReturnType<typeof useGetInvitationInfoQuery>;
export type GetInvitationInfoLazyQueryHookResult = ReturnType<typeof useGetInvitationInfoLazyQuery>;
export type GetInvitationInfoQueryResult = ApolloReactCommon.QueryResult<GetInvitationInfoQuery, GetInvitationInfoQueryVariables>;
export const InviteMembersDocument = gql`
    mutation inviteMembers($roomId: ObjectId!, $members: [ObjectId!]!) {
  invitations: inviteMembers(roomId: $roomId, members: $members) {
    id
    roomId
    isPublic
    userId
    invitedBy
    createdAt
  }
}
    `;
export type InviteMembersMutationFn = ApolloReactCommon.MutationFunction<InviteMembersMutation, InviteMembersMutationVariables>;

/**
 * __useInviteMembersMutation__
 *
 * To run a mutation, you first call `useInviteMembersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteMembersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteMembersMutation, { data, loading, error }] = useInviteMembersMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      members: // value for 'members'
 *   },
 * });
 */
export function useInviteMembersMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<InviteMembersMutation, InviteMembersMutationVariables>) {
        return ApolloReactHooks.useMutation<InviteMembersMutation, InviteMembersMutationVariables>(InviteMembersDocument, baseOptions);
      }
export type InviteMembersMutationHookResult = ReturnType<typeof useInviteMembersMutation>;
export type InviteMembersMutationResult = ApolloReactCommon.MutationResult<InviteMembersMutation>;
export type InviteMembersMutationOptions = ApolloReactCommon.BaseMutationOptions<InviteMembersMutation, InviteMembersMutationVariables>;
export const CreateInvitationLinkDocument = gql`
    mutation createInvitationLink($roomId: ObjectId!) {
  invitation: createInvitationLink(roomId: $roomId) {
    link
  }
}
    `;
export type CreateInvitationLinkMutationFn = ApolloReactCommon.MutationFunction<CreateInvitationLinkMutation, CreateInvitationLinkMutationVariables>;

/**
 * __useCreateInvitationLinkMutation__
 *
 * To run a mutation, you first call `useCreateInvitationLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvitationLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvitationLinkMutation, { data, loading, error }] = useCreateInvitationLinkMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useCreateInvitationLinkMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateInvitationLinkMutation, CreateInvitationLinkMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateInvitationLinkMutation, CreateInvitationLinkMutationVariables>(CreateInvitationLinkDocument, baseOptions);
      }
export type CreateInvitationLinkMutationHookResult = ReturnType<typeof useCreateInvitationLinkMutation>;
export type CreateInvitationLinkMutationResult = ApolloReactCommon.MutationResult<CreateInvitationLinkMutation>;
export type CreateInvitationLinkMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateInvitationLinkMutation, CreateInvitationLinkMutationVariables>;
export const AcceptInvitationDocument = gql`
    mutation acceptInvitation($token: String!) {
  acceptInvitation(token: $token)
}
    `;
export type AcceptInvitationMutationFn = ApolloReactCommon.MutationFunction<AcceptInvitationMutation, AcceptInvitationMutationVariables>;

/**
 * __useAcceptInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInvitationMutation, { data, loading, error }] = useAcceptInvitationMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAcceptInvitationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>) {
        return ApolloReactHooks.useMutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>(AcceptInvitationDocument, baseOptions);
      }
export type AcceptInvitationMutationHookResult = ReturnType<typeof useAcceptInvitationMutation>;
export type AcceptInvitationMutationResult = ApolloReactCommon.MutationResult<AcceptInvitationMutation>;
export type AcceptInvitationMutationOptions = ApolloReactCommon.BaseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const GetRoomDocument = gql`
    query getRoom($roomId: ObjectId!, $limit: Int!, $offset: Int!) {
  room: getRoom(id: $roomId) {
    id
    name
    owner
    createdAt
    members {
      ...RoomMember
    }
  }
  messages: getMessages(roomId: $roomId, limit: $limit, offset: $offset) {
    totalDocs
    totalPages
    messages {
      id
      roomId
      content
      createdAt
      mentions
      author {
        id
        name
        username
        avatarUrl
        color
      }
    }
  }
}
    ${RoomMemberFragmentDoc}`;

/**
 * __useGetRoomQuery__
 *
 * To run a query within a React component, call `useGetRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetRoomQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRoomQuery, GetRoomQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRoomQuery, GetRoomQueryVariables>(GetRoomDocument, baseOptions);
      }
export function useGetRoomLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRoomQuery, GetRoomQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRoomQuery, GetRoomQueryVariables>(GetRoomDocument, baseOptions);
        }
export type GetRoomQueryHookResult = ReturnType<typeof useGetRoomQuery>;
export type GetRoomLazyQueryHookResult = ReturnType<typeof useGetRoomLazyQuery>;
export type GetRoomQueryResult = ApolloReactCommon.QueryResult<GetRoomQuery, GetRoomQueryVariables>;
export const RemoveMemberDocument = gql`
    mutation removeMember($roomId: ObjectId!, $memberId: ObjectId!) {
  removedMember: removeMemberFromRoom(roomId: $roomId, memberId: $memberId) {
    ...RoomMember
  }
}
    ${RoomMemberFragmentDoc}`;
export type RemoveMemberMutationFn = ApolloReactCommon.MutationFunction<RemoveMemberMutation, RemoveMemberMutationVariables>;

/**
 * __useRemoveMemberMutation__
 *
 * To run a mutation, you first call `useRemoveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMemberMutation, { data, loading, error }] = useRemoveMemberMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useRemoveMemberMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveMemberMutation, RemoveMemberMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveMemberMutation, RemoveMemberMutationVariables>(RemoveMemberDocument, baseOptions);
      }
export type RemoveMemberMutationHookResult = ReturnType<typeof useRemoveMemberMutation>;
export type RemoveMemberMutationResult = ApolloReactCommon.MutationResult<RemoveMemberMutation>;
export type RemoveMemberMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveMemberMutation, RemoveMemberMutationVariables>;
export const CreateRoomDocument = gql`
    mutation createRoom($name: String!) {
  newRoom: createRoom(name: $name) {
    id
    name
    createdAt
    owner
  }
}
    `;
export type CreateRoomMutationFn = ApolloReactCommon.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, baseOptions);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = ApolloReactCommon.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const DeleteRoomDocument = gql`
    mutation deleteRoom($roomId: ObjectId!) {
  deletedRoom: deleteRoom(roomId: $roomId) {
    id
    name
    createdAt
    owner
  }
}
    `;
export type DeleteRoomMutationFn = ApolloReactCommon.MutationFunction<DeleteRoomMutation, DeleteRoomMutationVariables>;

/**
 * __useDeleteRoomMutation__
 *
 * To run a mutation, you first call `useDeleteRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoomMutation, { data, loading, error }] = useDeleteRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useDeleteRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRoomMutation, DeleteRoomMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRoomMutation, DeleteRoomMutationVariables>(DeleteRoomDocument, baseOptions);
      }
export type DeleteRoomMutationHookResult = ReturnType<typeof useDeleteRoomMutation>;
export type DeleteRoomMutationResult = ApolloReactCommon.MutationResult<DeleteRoomMutation>;
export type DeleteRoomMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRoomMutation, DeleteRoomMutationVariables>;
export const SendMessageDocument = gql`
    mutation sendMessage($roomId: ObjectId!, $content: String!) {
  sendMessage(roomId: $roomId, content: $content) {
    id
    roomId
    content
    createdAt
    mentions
    author {
      id
      name
      username
      avatarUrl
      color
    }
  }
}
    `;
export type SendMessageMutationFn = ApolloReactCommon.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        return ApolloReactHooks.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, baseOptions);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = ApolloReactCommon.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation deleteMessage($messageId: ObjectId!) {
  deletedMessage: deleteMessage(messageId: $messageId) {
    ...MessageParts
  }
}
    ${MessagePartsFragmentDoc}`;
export type DeleteMessageMutationFn = ApolloReactCommon.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, baseOptions);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = ApolloReactCommon.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const EditMessageDocument = gql`
    mutation editMessage($messageId: ObjectId!, $content: String!) {
  editedMessage: editMessage(messageId: $messageId, content: $content) {
    ...MessageParts
  }
}
    ${MessagePartsFragmentDoc}`;
export type EditMessageMutationFn = ApolloReactCommon.MutationFunction<EditMessageMutation, EditMessageMutationVariables>;

/**
 * __useEditMessageMutation__
 *
 * To run a mutation, you first call `useEditMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editMessageMutation, { data, loading, error }] = useEditMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useEditMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditMessageMutation, EditMessageMutationVariables>) {
        return ApolloReactHooks.useMutation<EditMessageMutation, EditMessageMutationVariables>(EditMessageDocument, baseOptions);
      }
export type EditMessageMutationHookResult = ReturnType<typeof useEditMessageMutation>;
export type EditMessageMutationResult = ApolloReactCommon.MutationResult<EditMessageMutation>;
export type EditMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<EditMessageMutation, EditMessageMutationVariables>;
export const OnNewMessageDocument = gql`
    subscription onNewMessage($roomId: ObjectId!) {
  onNewMessage(roomId: $roomId) {
    ...SubscriptionMessageParts
  }
}
    ${SubscriptionMessagePartsFragmentDoc}`;

/**
 * __useOnNewMessageSubscription__
 *
 * To run a query within a React component, call `useOnNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewMessageSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useOnNewMessageSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<OnNewMessageSubscription, OnNewMessageSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<OnNewMessageSubscription, OnNewMessageSubscriptionVariables>(OnNewMessageDocument, baseOptions);
      }
export type OnNewMessageSubscriptionHookResult = ReturnType<typeof useOnNewMessageSubscription>;
export type OnNewMessageSubscriptionResult = ApolloReactCommon.SubscriptionResult<OnNewMessageSubscription>;
export const OnDeleteMessageDocument = gql`
    subscription onDeleteMessage($roomId: ObjectId!) {
  onDeleteMessage(roomId: $roomId) {
    ...SubscriptionMessageParts
  }
}
    ${SubscriptionMessagePartsFragmentDoc}`;

/**
 * __useOnDeleteMessageSubscription__
 *
 * To run a query within a React component, call `useOnDeleteMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnDeleteMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnDeleteMessageSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useOnDeleteMessageSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<OnDeleteMessageSubscription, OnDeleteMessageSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<OnDeleteMessageSubscription, OnDeleteMessageSubscriptionVariables>(OnDeleteMessageDocument, baseOptions);
      }
export type OnDeleteMessageSubscriptionHookResult = ReturnType<typeof useOnDeleteMessageSubscription>;
export type OnDeleteMessageSubscriptionResult = ApolloReactCommon.SubscriptionResult<OnDeleteMessageSubscription>;
export const OnUpdateMessageDocument = gql`
    subscription onUpdateMessage($roomId: ObjectId!) {
  onUpdateMessage(roomId: $roomId) {
    ...SubscriptionMessageParts
  }
}
    ${SubscriptionMessagePartsFragmentDoc}`;

/**
 * __useOnUpdateMessageSubscription__
 *
 * To run a query within a React component, call `useOnUpdateMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnUpdateMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnUpdateMessageSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useOnUpdateMessageSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<OnUpdateMessageSubscription, OnUpdateMessageSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<OnUpdateMessageSubscription, OnUpdateMessageSubscriptionVariables>(OnUpdateMessageDocument, baseOptions);
      }
export type OnUpdateMessageSubscriptionHookResult = ReturnType<typeof useOnUpdateMessageSubscription>;
export type OnUpdateMessageSubscriptionResult = ApolloReactCommon.SubscriptionResult<OnUpdateMessageSubscription>;
export const CurrentUserDocument = gql`
    query currentUser {
  me {
    id
    name
    email
    username
    avatarUrl
    color
    links {
      github
      twitter
      instagram
      website
    }
    rooms {
      id
      name
      owner
    }
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        return ApolloReactHooks.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
      }
export function useCurrentUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = ApolloReactCommon.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const ListUsersDocument = gql`
    query listUsers {
  users: listUsers {
    id
    name
    avatarUrl
    username
    color
    rooms
    createdAt
    links {
      github
      twitter
      instagram
      website
    }
  }
}
    `;

/**
 * __useListUsersQuery__
 *
 * To run a query within a React component, call `useListUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useListUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
        return ApolloReactHooks.useQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, baseOptions);
      }
export function useListUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListUsersQuery, ListUsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, baseOptions);
        }
export type ListUsersQueryHookResult = ReturnType<typeof useListUsersQuery>;
export type ListUsersLazyQueryHookResult = ReturnType<typeof useListUsersLazyQuery>;
export type ListUsersQueryResult = ApolloReactCommon.QueryResult<ListUsersQuery, ListUsersQueryVariables>;
export const ListCurrentUserRoomsDocument = gql`
    query ListCurrentUserRooms {
  currentUserRooms: listCurrentUserRooms {
    id
    name
    createdAt
    owner
  }
}
    `;

/**
 * __useListCurrentUserRoomsQuery__
 *
 * To run a query within a React component, call `useListCurrentUserRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListCurrentUserRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListCurrentUserRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListCurrentUserRoomsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListCurrentUserRoomsQuery, ListCurrentUserRoomsQueryVariables>) {
        return ApolloReactHooks.useQuery<ListCurrentUserRoomsQuery, ListCurrentUserRoomsQueryVariables>(ListCurrentUserRoomsDocument, baseOptions);
      }
export function useListCurrentUserRoomsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListCurrentUserRoomsQuery, ListCurrentUserRoomsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ListCurrentUserRoomsQuery, ListCurrentUserRoomsQueryVariables>(ListCurrentUserRoomsDocument, baseOptions);
        }
export type ListCurrentUserRoomsQueryHookResult = ReturnType<typeof useListCurrentUserRoomsQuery>;
export type ListCurrentUserRoomsLazyQueryHookResult = ReturnType<typeof useListCurrentUserRoomsLazyQuery>;
export type ListCurrentUserRoomsQueryResult = ApolloReactCommon.QueryResult<ListCurrentUserRoomsQuery, ListCurrentUserRoomsQueryVariables>;
export const GetNotificationsDocument = gql`
    query getNotifications {
  notifications: getNotifications {
    ...NotificationData
  }
}
    ${NotificationDataFragmentDoc}`;

/**
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNotificationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, baseOptions);
      }
export function useGetNotificationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, baseOptions);
        }
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>;
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>;
export type GetNotificationsQueryResult = ApolloReactCommon.QueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const ReadNotificationDocument = gql`
    mutation readNotification($id: ObjectId!) {
  readNotification(id: $id) {
    ...NotificationData
  }
}
    ${NotificationDataFragmentDoc}`;
export type ReadNotificationMutationFn = ApolloReactCommon.MutationFunction<ReadNotificationMutation, ReadNotificationMutationVariables>;

/**
 * __useReadNotificationMutation__
 *
 * To run a mutation, you first call `useReadNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readNotificationMutation, { data, loading, error }] = useReadNotificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useReadNotificationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReadNotificationMutation, ReadNotificationMutationVariables>) {
        return ApolloReactHooks.useMutation<ReadNotificationMutation, ReadNotificationMutationVariables>(ReadNotificationDocument, baseOptions);
      }
export type ReadNotificationMutationHookResult = ReturnType<typeof useReadNotificationMutation>;
export type ReadNotificationMutationResult = ApolloReactCommon.MutationResult<ReadNotificationMutation>;
export type ReadNotificationMutationOptions = ApolloReactCommon.BaseMutationOptions<ReadNotificationMutation, ReadNotificationMutationVariables>;
export const SetUserColorDocument = gql`
    mutation setUserColor($color: String!) {
  setColor(color: $color) {
    id
    color
  }
}
    `;
export type SetUserColorMutationFn = ApolloReactCommon.MutationFunction<SetUserColorMutation, SetUserColorMutationVariables>;

/**
 * __useSetUserColorMutation__
 *
 * To run a mutation, you first call `useSetUserColorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserColorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserColorMutation, { data, loading, error }] = useSetUserColorMutation({
 *   variables: {
 *      color: // value for 'color'
 *   },
 * });
 */
export function useSetUserColorMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetUserColorMutation, SetUserColorMutationVariables>) {
        return ApolloReactHooks.useMutation<SetUserColorMutation, SetUserColorMutationVariables>(SetUserColorDocument, baseOptions);
      }
export type SetUserColorMutationHookResult = ReturnType<typeof useSetUserColorMutation>;
export type SetUserColorMutationResult = ApolloReactCommon.MutationResult<SetUserColorMutation>;
export type SetUserColorMutationOptions = ApolloReactCommon.BaseMutationOptions<SetUserColorMutation, SetUserColorMutationVariables>;
export const SetUserLinksDocument = gql`
    mutation setUserLinks($github: String, $twitter: String, $instagram: String, $website: String) {
  setUserLinks(github: $github, twitter: $twitter, instagram: $instagram, website: $website) {
    id
    links {
      github
      twitter
      instagram
      website
    }
  }
}
    `;
export type SetUserLinksMutationFn = ApolloReactCommon.MutationFunction<SetUserLinksMutation, SetUserLinksMutationVariables>;

/**
 * __useSetUserLinksMutation__
 *
 * To run a mutation, you first call `useSetUserLinksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserLinksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserLinksMutation, { data, loading, error }] = useSetUserLinksMutation({
 *   variables: {
 *      github: // value for 'github'
 *      twitter: // value for 'twitter'
 *      instagram: // value for 'instagram'
 *      website: // value for 'website'
 *   },
 * });
 */
export function useSetUserLinksMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetUserLinksMutation, SetUserLinksMutationVariables>) {
        return ApolloReactHooks.useMutation<SetUserLinksMutation, SetUserLinksMutationVariables>(SetUserLinksDocument, baseOptions);
      }
export type SetUserLinksMutationHookResult = ReturnType<typeof useSetUserLinksMutation>;
export type SetUserLinksMutationResult = ApolloReactCommon.MutationResult<SetUserLinksMutation>;
export type SetUserLinksMutationOptions = ApolloReactCommon.BaseMutationOptions<SetUserLinksMutation, SetUserLinksMutationVariables>;
export const SetUserSettingsDocument = gql`
    mutation setUserSettings($color: String!, $github: String, $twitter: String, $instagram: String, $website: String) {
  setColor(color: $color) {
    id
    color
  }
  setUserLinks(github: $github, twitter: $twitter, instagram: $instagram, website: $website) {
    id
    links {
      github
      twitter
      instagram
      website
    }
  }
}
    `;
export type SetUserSettingsMutationFn = ApolloReactCommon.MutationFunction<SetUserSettingsMutation, SetUserSettingsMutationVariables>;

/**
 * __useSetUserSettingsMutation__
 *
 * To run a mutation, you first call `useSetUserSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserSettingsMutation, { data, loading, error }] = useSetUserSettingsMutation({
 *   variables: {
 *      color: // value for 'color'
 *      github: // value for 'github'
 *      twitter: // value for 'twitter'
 *      instagram: // value for 'instagram'
 *      website: // value for 'website'
 *   },
 * });
 */
export function useSetUserSettingsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetUserSettingsMutation, SetUserSettingsMutationVariables>) {
        return ApolloReactHooks.useMutation<SetUserSettingsMutation, SetUserSettingsMutationVariables>(SetUserSettingsDocument, baseOptions);
      }
export type SetUserSettingsMutationHookResult = ReturnType<typeof useSetUserSettingsMutation>;
export type SetUserSettingsMutationResult = ApolloReactCommon.MutationResult<SetUserSettingsMutation>;
export type SetUserSettingsMutationOptions = ApolloReactCommon.BaseMutationOptions<SetUserSettingsMutation, SetUserSettingsMutationVariables>;
export const OnNewNotificationDocument = gql`
    subscription onNewNotification {
  onNewNotification {
    ...NotificationData
  }
}
    ${NotificationDataFragmentDoc}`;

/**
 * __useOnNewNotificationSubscription__
 *
 * To run a query within a React component, call `useOnNewNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewNotificationSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnNewNotificationSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<OnNewNotificationSubscription, OnNewNotificationSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<OnNewNotificationSubscription, OnNewNotificationSubscriptionVariables>(OnNewNotificationDocument, baseOptions);
      }
export type OnNewNotificationSubscriptionHookResult = ReturnType<typeof useOnNewNotificationSubscription>;
export type OnNewNotificationSubscriptionResult = ApolloReactCommon.SubscriptionResult<OnNewNotificationSubscription>;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;