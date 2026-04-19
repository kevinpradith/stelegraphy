interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SwapButton({ onClick, disabled }: SwapButtonProps) {
  return (
    <button
      className="swap-btn"
      onClick={onClick}
      disabled={disabled}
      title="Swap input ↔ output and flip mode"
      aria-label="Swap input and output"
    >
      {/* Double-arrow icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 5h10M9 2l3 3-3 3M14 11H4M7 8l-3 3 3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
