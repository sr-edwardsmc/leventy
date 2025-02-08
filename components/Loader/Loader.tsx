export const Loader = ({ message }: { message: string }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        {/* <!-- Loader - Show animated loading bar --> */}
        <h2 className="text-lg font-bold text-black dark:text-white mb-5">
          {message}
        </h2>
        <div className="flex justify-center items-center gap-3">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};
