import { Button, Empty } from "antd";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-screnn h-screen flex flex-col justify-center items-center">
      <Empty className="mb-5" description="Page not found" />
      <Button
        onClick={goBack}
        className=""
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
        Back
      </Button>
    </div>
  );
}
