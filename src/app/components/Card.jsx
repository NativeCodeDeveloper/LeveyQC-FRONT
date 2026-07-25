export default function Card({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag
      className={`overflow-hidden rounded-lg border border-line bg-white shadow-[0_1px_2px_rgba(29,29,31,0.04)] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
