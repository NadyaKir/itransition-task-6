import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { Button, Input, Flex } from "antd";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (userName.trim() !== "") {
      navigate("/boards");
    }
  };

  return (
    <div className="h-screen">
      <div className="h-screen flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" className="w-64 h-auto mb-3" />
        <Flex justify="center" align="center" gap="small">
          <Input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              borderColor: "#FFA500",
            }}
          />
          <Button
            onClick={handleEnter}
            type="primary"
            shape="round"
            size="large"
            ghost
            htmlType="submit"
            style={{
              backgroundColor: "#FFA500",
              borderColor: "#FFA500",
              color: "white",
              transition: "background-color 0.3s",
            }}
          >
            Enter
          </Button>
        </Flex>
      </div>
    </div>
  );
}
