import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { Card, Layout, Spin, Typography } from "antd";
import { LOG_IN } from "../../lib/graphql/mutations";
import { ErrorBanner } from "../../lib/components";
import { AUTH_URL } from "../../lib/graphql/queries";
import {
  LogIn as LogInData,
  LogInVariables
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { authUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/authUrl";
import { displayErrorMessage, displaySuccessNotification } from "../../lib/utils";
import { Viewer } from "../../lib/types";

import googleLogo from "./assets/google_logo.jpg";
import { useScrollToTop } from "../../lib/hooks";

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError }
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn);
        sessionStorage.setItem("token", data.logIn.token)
        displaySuccessNotification("You've success loggen in")
      }
    }
  });

  const logInRef = useRef(logIn);
  
  useScrollToTop();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code }
        }
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL
      });
      window.location.href = data.authUrl;
    } catch {
      displayErrorMessage("Sorry! We weren't able to log you in. Please try again later!")
    }
  };

  if(logInLoading) {
      return (
          <Content className="log-in">
              <Spin size="large" tip="Logging you in..."/>
          </Content>
      )
  }

  if(logInData && logInData.logIn) {
      const {id: viewrId} = logInData.logIn;
      return <Redirect to={`/user/${viewrId}`}/>
  }

  const logInErrorBannerElement = logInError ? (
      <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!"/>
  ) : null

  return (
    <Content className="log-in">
        {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              ????
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
