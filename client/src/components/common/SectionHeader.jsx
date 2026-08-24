function SectionHeader({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-[#1E293B]">
        {title}
      </h2>

      {action}
    </div>
  );
}

export default SectionHeader;