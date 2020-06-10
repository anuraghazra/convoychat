import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import {
  useGetInvitationInfoQuery,
  useAcceptInvitationMutation,
} from "graphql/generated/graphql";

import { Button, Loading } from "@convoy-ui";

import ConvoyLogo from "components/ConvoyLogo";
import HomeWrapper from "../HomeWrapper.style";

const Invitation: React.FC = () => {
  const { token } = useParams();
  const history = useHistory();
  const [
    acceptInvitation,
    { loading: acceptInvitationLoading },
  ] = useAcceptInvitationMutation({
    variables: { token },
    onError(err) {
      console.log(err);
    },
    onCompleted() {
      history.push("/");
    },
  });

  const {
    data: invite,
    loading: inviteLoading,
    error: inviteError,
  } = useGetInvitationInfoQuery({
    variables: { token },
  });

  const isLoading = inviteLoading;
  return (
    <HomeWrapper>
      <ConvoyLogo />
      <div className="wrapper_card">
        {inviteError ? (
          <p>Invalid Invitation</p>
        ) : isLoading ? (
          <Loading />
        ) : (
          <div>
            <h2>
              Invitation from{" "}
              <span className="textcolor--primary">
                {invite?.invitationInfo?.room?.name}
              </span>
            </h2>
            <p>
              {invite?.invitationInfo?.invitedBy?.name} Invited you to join
              {invite?.invitationInfo?.room?.name}, join their community now!
            </p>
            <Button
              isLoading={acceptInvitationLoading}
              icon={FaThumbsUp}
              onClick={acceptInvitation}
            >
              Accept Invitation
            </Button>
          </div>
        )}
      </div>
    </HomeWrapper>
  );
};

export default Invitation;
