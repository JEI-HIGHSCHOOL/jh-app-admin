import LottieAnimaition from "./LottieAnimaition";

const Loading = () => {
  return (
    <>
      <div
        id="loading"
        className="fixed top-0 left-0 h-full w-full backdrop-blur-sm"
        style={{
          transition: "all .3s ease",
          zIndex: "1000",
          background: "rgba(0,0,0,.3)",
        }}
      >
        <div className="flex h-full items-center justify-center opacity-100">
          <LottieAnimaition className="h-64 w-64 p-12" animation={require('../animation/loading.json')}/>
        </div>
      </div>
    </>
  );
};
export default Loading;
