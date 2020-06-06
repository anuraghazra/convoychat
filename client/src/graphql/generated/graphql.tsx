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
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Invitation = {
  __typename?: 'Invitation';
  id: Scalars['ID'];
  roomId: Scalars['ID'];
  userId: Scalars['ID'];
  invitedBy: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  createdAt: Scalars['String'];
};

export type InvitationDetails = {
  __typename?: 'InvitationDetails';
  id: Scalars['ID'];
  room?: Maybe<Room>;
  invitedBy: Member;
  isPublic: Scalars['Boolean'];
  createdAt: Scalars['String'];
};

export type InvitationLinkResult = {
  __typename?: 'InvitationLinkResult';
  link: Scalars['String'];
};



export type Me = {
  __typename?: 'Me';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  rooms: Array<Room>;
  avatarUrl?: Maybe<Scalars['String']>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['ID'];
  name: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  rooms: Array<Scalars['ID']>;
  createdAt: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  roomId: Scalars['ID'];
  author: Member;
  content: Scalars['String'];
  createdAt: Scalars['String'];
};

export type Messages = {
  __typename?: 'Messages';
  totalDocs?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
  messages: Array<Message>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: Room;
  addMembersToRoom: Room;
  deleteRoom?: Maybe<Room>;
  sendMessage: Message;
  deleteMessage: Message;
  editMessage: Message;
  inviteMembers: Array<Invitation>;
  acceptInvitation?: Maybe<Scalars['Boolean']>;
  createInvitationLink: InvitationLinkResult;
  logout?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateRoomArgs = {
  name: Scalars['String'];
};


export type MutationAddMembersToRoomArgs = {
  roomId: Scalars['ID'];
  members: Array<Scalars['ID']>;
};


export type MutationDeleteRoomArgs = {
  roomId: Scalars['ID'];
};


export type MutationSendMessageArgs = {
  roomId: Scalars['ID'];
  content: Scalars['String'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['ID'];
};


export type MutationEditMessageArgs = {
  messageId: Scalars['ID'];
  content: Scalars['String'];
};


export type MutationInviteMembersArgs = {
  roomId: Scalars['ID'];
  members: Array<Scalars['ID']>;
};


export type MutationAcceptInvitationArgs = {
  token: Scalars['String'];
};


export type MutationCreateInvitationLinkArgs = {
  roomId: Scalars['ID'];
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID'];
  author: Scalars['ID'];
  type: Notification_Types;
  payload?: Maybe<Scalars['JSONObject']>;
};

export enum Notification_Types {
  Invitation = 'INVITATION',
  Mention = 'MENTION'
}

export type Query = {
  __typename?: 'Query';
  me: Me;
  listUsers: Array<User>;
  listRooms: Array<Room>;
  listCurrentUserRooms: Array<Maybe<Room>>;
  getMessages?: Maybe<Messages>;
  getNotifications: Array<Maybe<Notification>>;
  getUser: User;
  getRoom: Room;
  getInvitationInfo: InvitationDetails;
};


export type QueryGetMessagesArgs = {
  roomId: Scalars['ID'];
  offset: Scalars['Int'];
  limit: Scalars['Int'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetRoomArgs = {
  id: Scalars['ID'];
};


export type QueryGetInvitationInfoArgs = {
  token: Scalars['String'];
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['ID'];
  name: Scalars['String'];
  members: Array<Member>;
  messages: Array<Message>;
  createdAt: Scalars['String'];
  owner: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onNewMessage: Message;
  onDeleteMessage: Message;
  onUpdateMessage: Message;
};


export type SubscriptionOnNewMessageArgs = {
  roomId: Scalars['ID'];
};


export type SubscriptionOnDeleteMessageArgs = {
  roomId: Scalars['ID'];
};


export type SubscriptionOnUpdateMessageArgs = {
  roomId: Scalars['ID'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  username: Scalars['String'];
  rooms: Array<Room>;
  createdAt: Scalars['String'];
};

export type GetInvitationInfoQueryVariables = {
  token: Scalars['String'];
};


export type GetInvitationInfoQuery = (
  { __typename?: 'Query' }
  & { getInvitationInfo: (
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

export type CreateInvitationLinkMutationVariables = {
  roomId: Scalars['ID'];
};


export type CreateInvitationLinkMutation = (
  { __typename?: 'Mutation' }
  & { createInvitationLink: (
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

export type GetRoomQueryVariables = {
  roomId: Scalars['ID'];
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
      & Pick<Member, 'username' | 'name' | 'avatarUrl' | 'createdAt' | 'id'>
    )> }
  ), messages?: Maybe<(
    { __typename?: 'Messages' }
    & Pick<Messages, 'totalDocs' | 'totalPages'>
    & { messages: Array<(
      { __typename?: 'Message' }
      & Pick<Message, 'id' | 'roomId' | 'content' | 'createdAt'>
      & { author: (
        { __typename?: 'Member' }
        & Pick<Member, 'id' | 'name' | 'username' | 'avatarUrl'>
      ) }
    )> }
  )> }
);

export type ListRoomsQueryVariables = {};


export type ListRoomsQuery = (
  { __typename?: 'Query' }
  & { listRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  )> }
);

export type CreateRoomMutationVariables = {
  name: Scalars['String'];
};


export type CreateRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  ) }
);

export type DeleteRoomMutationVariables = {
  roomId: Scalars['ID'];
};


export type DeleteRoomMutation = (
  { __typename?: 'Mutation' }
  & { deleteRoom?: Maybe<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  )> }
);

export type MessagePartsFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'roomId' | 'content' | 'createdAt'>
  & { author: (
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'username'>
  ) }
);

export type SubscriptionMessagePartsFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'content' | 'roomId' | 'createdAt'>
  & { author: (
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'name' | 'username' | 'avatarUrl'>
  ) }
);

export type SendMessageMutationVariables = {
  roomId: Scalars['ID'];
  content: Scalars['String'];
};


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & { sendMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'roomId' | 'content' | 'createdAt'>
    & { author: (
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'name' | 'username' | 'avatarUrl'>
    ) }
  ) }
);

export type DeleteMessageMutationVariables = {
  messageId: Scalars['ID'];
};


export type DeleteMessageMutation = (
  { __typename?: 'Mutation' }
  & { deleteMessage: (
    { __typename?: 'Message' }
    & MessagePartsFragment
  ) }
);

export type EditMessageMutationVariables = {
  messageId: Scalars['ID'];
  content: Scalars['String'];
};


export type EditMessageMutation = (
  { __typename?: 'Mutation' }
  & { editMessage: (
    { __typename?: 'Message' }
    & MessagePartsFragment
  ) }
);

export type OnNewMessageSubscriptionVariables = {
  roomId: Scalars['ID'];
};


export type OnNewMessageSubscription = (
  { __typename?: 'Subscription' }
  & { onNewMessage: (
    { __typename?: 'Message' }
    & SubscriptionMessagePartsFragment
  ) }
);

export type OnDeleteMessageSubscriptionVariables = {
  roomId: Scalars['ID'];
};


export type OnDeleteMessageSubscription = (
  { __typename?: 'Subscription' }
  & { onDeleteMessage: (
    { __typename?: 'Message' }
    & SubscriptionMessagePartsFragment
  ) }
);

export type OnUpdateMessageSubscriptionVariables = {
  roomId: Scalars['ID'];
};


export type OnUpdateMessageSubscription = (
  { __typename?: 'Subscription' }
  & { onUpdateMessage: (
    { __typename?: 'Message' }
    & SubscriptionMessagePartsFragment
  ) }
);

export type CurrentUserQueryVariables = {};


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'Me' }
    & Pick<Me, 'id' | 'name' | 'email' | 'username' | 'avatarUrl'>
    & { rooms: Array<(
      { __typename?: 'Room' }
      & Pick<Room, 'id' | 'name' | 'owner'>
    )> }
  ) }
);

export type ListUsersQueryVariables = {};


export type ListUsersQuery = (
  { __typename?: 'Query' }
  & { listUsers: Array<(
    { __typename?: 'User' }
    & Pick<User, 'username' | 'id'>
    & { rooms: Array<(
      { __typename?: 'Room' }
      & Pick<Room, 'id'>
    )> }
  )> }
);

export type ListCurrentUserRoomsQueryVariables = {};


export type ListCurrentUserRoomsQuery = (
  { __typename?: 'Query' }
  & { listCurrentUserRooms: Array<Maybe<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  )>> }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export const MessagePartsFragmentDoc = gql`
    fragment MessageParts on Message {
  id
  roomId
  content
  createdAt
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
  author {
    id
    name
    username
    avatarUrl
  }
}
    `;
export const GetInvitationInfoDocument = gql`
    query getInvitationInfo($token: String!) {
  getInvitationInfo(token: $token) {
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
export const CreateInvitationLinkDocument = gql`
    mutation createInvitationLink($roomId: ID!) {
  createInvitationLink(roomId: $roomId) {
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
    query getRoom($roomId: ID!, $limit: Int!, $offset: Int!) {
  room: getRoom(id: $roomId) {
    id
    name
    owner
    createdAt
    members {
      username
      name
      avatarUrl
      createdAt
      id
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
      author {
        id
        name
        username
        avatarUrl
      }
    }
  }
}
    `;

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
export const ListRoomsDocument = gql`
    query ListRooms {
  listRooms {
    id
    name
    createdAt
    owner
  }
}
    `;

/**
 * __useListRoomsQuery__
 *
 * To run a query within a React component, call `useListRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListRoomsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListRoomsQuery, ListRoomsQueryVariables>) {
        return ApolloReactHooks.useQuery<ListRoomsQuery, ListRoomsQueryVariables>(ListRoomsDocument, baseOptions);
      }
export function useListRoomsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListRoomsQuery, ListRoomsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ListRoomsQuery, ListRoomsQueryVariables>(ListRoomsDocument, baseOptions);
        }
export type ListRoomsQueryHookResult = ReturnType<typeof useListRoomsQuery>;
export type ListRoomsLazyQueryHookResult = ReturnType<typeof useListRoomsLazyQuery>;
export type ListRoomsQueryResult = ApolloReactCommon.QueryResult<ListRoomsQuery, ListRoomsQueryVariables>;
export const CreateRoomDocument = gql`
    mutation createRoom($name: String!) {
  createRoom(name: $name) {
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
    mutation deleteRoom($roomId: ID!) {
  deleteRoom(roomId: $roomId) {
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
    mutation sendMessage($roomId: ID!, $content: String!) {
  sendMessage(roomId: $roomId, content: $content) {
    id
    roomId
    content
    createdAt
    author {
      id
      name
      username
      avatarUrl
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
    mutation deleteMessage($messageId: ID!) {
  deleteMessage(messageId: $messageId) {
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
    mutation editMessage($messageId: ID!, $content: String!) {
  editMessage(messageId: $messageId, content: $content) {
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
    subscription onNewMessage($roomId: ID!) {
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
    subscription onDeleteMessage($roomId: ID!) {
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
    subscription onUpdateMessage($roomId: ID!) {
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
    query ListUsers {
  listUsers {
    username
    id
    rooms {
      id
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
  listCurrentUserRooms {
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