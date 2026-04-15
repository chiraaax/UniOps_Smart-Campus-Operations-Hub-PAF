function LoadingSpinner({ size = "md", message = "Loading..." }) {
  const sizeClass = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }[size];

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <div
        className={`${sizeClass} animate-spin rounded-full border-4 border-indigo-600 border-t-transparent`}
      />
      {message && <p className="mt-3 text-sm text-gray-500">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
