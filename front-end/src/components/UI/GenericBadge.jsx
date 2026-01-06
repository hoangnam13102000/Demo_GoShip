const GenericBadge = ({
  value,
  config,
  label,
  showDot = true,
}) => {
  const badgeConfig =
    config[value] || config.DEFAULT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badgeConfig.className}`}
    >
      {showDot && badgeConfig.dotColor && (
        <span
          className={`w-2 h-2 rounded-full ${badgeConfig.dotColor}`}
        />
      )}
      {label || value}
    </span>
  );
};

export default GenericBadge;
