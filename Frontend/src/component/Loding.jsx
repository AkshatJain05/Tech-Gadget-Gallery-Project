const Loading = () => {
  const dots = Array(8).fill(0);
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-16 h-16 animate-spin">
        {dots.map((_, i) => {
          const angle = (360 / dots.length) * i;
          return (
            <div
              key={i}
              className="absolute w-3 h-3 bg-blue-500 rounded-full opacity-70"
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-6px',
                marginLeft: '-6px',
                transform: `rotate(${angle}deg) translate(24px)`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Loading;
