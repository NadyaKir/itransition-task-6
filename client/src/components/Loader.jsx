import { Spin } from "antd";

export default function Loader() {
  return (
    <div className="h-full flex flex-1 justify-center items-center">
      <Spin />
    </div>
  );
}
