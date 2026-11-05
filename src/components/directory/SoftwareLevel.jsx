export default function SoftwareLevel({ name, level }) {
  if (!Number.isFinite(level) || level < 1 || level > 5) return null;
  return (
    <span className="directory-software-level" role="meter" aria-label={`${name}の習熟度`} aria-valuemin={0} aria-valuemax={5} aria-valuenow={level}>
      <span style={{ width: `${level * 20}%` }} />
    </span>
  );
}
