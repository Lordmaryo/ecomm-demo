const LoadingSpinner = () => {
  return (
    <div className="flex mt-20 justify-center min-h-screen bg-white">
      <div className="relative">
        <div className="w-10 h-10 border-black border-2 rounded-full" />
        <div className="w-10 h-10 border-white border-t-2 animate-spin rounded-full absolute left-0 top-0" />
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
