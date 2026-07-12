const Spinner = ({ size = 'h-5 w-5' }) => (
  <span className={`inline-block animate-spin rounded-full ${size} border-2 border-white/30 border-t-white`}></span>
);
export default Spinner;