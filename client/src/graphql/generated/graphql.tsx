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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

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

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: Room;
  addMembersToRoom: Room;
  sendMessage: Message;
  logout?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateRoomArgs = {
  name: Scalars['String'];
};


export type MutationAddMembersToRoomArgs = {
  roomId: Scalars['ID'];
  members: Array<Scalars['ID']>;
};


export type MutationSendMessageArgs = {
  roomId: Scalars['ID'];
  content: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: Me;
  listUsers: Array<User>;
  listRooms: Array<Room>;
  getUser: User;
  getRoom: Room;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetRoomArgs = {
  id: Scalars['ID'];
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
  newMessage: Message;
};


export type SubscriptionNewMessageArgs = {
  roomId: Scalars['ID'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  rooms: Array<Room>;
  createdAt: Scalars['String'];
};

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

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type GetRoomQueryVariables = {
  roomId: Scalars['ID'];
};


export type GetRoomQuery = (
  { __typename?: 'Query' }
  & { getRoom: (
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
    & { members: Array<(
      { __typename?: 'Member' }
      & Pick<Member, 'username' | 'name' | 'avatarUrl' | 'createdAt' | 'id'>
    )>, messages: Array<(
      { __typename?: 'Message' }
      & Pick<Message, 'id' | 'content' | 'roomId'>
      & { author: (
        { __typename?: 'Member' }
        & Pick<Member, 'name' | 'username' | 'avatarUrl' | 'createdAt'>
      ) }
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

export type ListRoomsQueryVariables = {};


export type ListRoomsQuery = (
  { __typename?: 'Query' }
  & { listRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'name' | 'createdAt' | 'owner'>
  )> }
);

export type NewMessageSubscriptionVariables = {
  roomId: Scalars['ID'];
};


export type NewMessageSubscription = (
  { __typename?: 'Subscription' }
  & { newMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'roomId' | 'content' | 'createdAt'>
    & { author: (
      { __typename?: 'Member' }
      & Pick<Member, 'username'>
    ) }
  ) }
);


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
export const GetRoomDocument = gql`
    query getRoom($roomId: ID!) {
  getRoom(id: $roomId) {
    id
    name
    members {
      username
      name
      avatarUrl
      createdAt
      id
    }
    messages {
      id
      content
      roomId
      author {
        name
        username
        avatarUrl
        createdAt
      }
    }
    createdAt
    owner
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
export const NewMessageDocument = gql`
    subscription newMessage($roomId: ID!) {
  newMessage(roomId: $roomId) {
    id
    roomId
    author {
      username
    }
    content
    createdAt
  }
}
    `;

/**
 * __useNewMessageSubscription__
 *
 * To run a query within a React component, call `useNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useNewMessageSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<NewMessageSubscription, NewMessageSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<NewMessageSubscription, NewMessageSubscriptionVariables>(NewMessageDocument, baseOptions);
      }
export type NewMessageSubscriptionHookResult = ReturnType<typeof useNewMessageSubscription>;
export type NewMessageSubscriptionResult = ApolloReactCommon.SubscriptionResult<NewMessageSubscription>;