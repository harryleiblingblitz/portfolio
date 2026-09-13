import { Link } from 'react-router-dom';

// Every value below was measured directly off the source photo
// (public/images/aircraft/a350-lights-off.webp, 2170x725): each window's
// actual x position was found by scanning the fuselage window row for
// individual dark-window dips (and, for the windows that were pre-lit in
// the original reference photo, by locating those lit blobs directly).
// The y position follows a linear fit through the window row's real
// vertical positions, which drift slightly downward toward the nose due
// to the photo's perspective. Positions were verified by overlaying markers
// on the original photo and checking every dot sits on a real window.
const IMAGE_W = 2170;
const IMAGE_H = 725;

// x-centre of every real passenger window along the fuselage, tail (left) to
// nose (right) — bounded to the true window row confirmed against a
// reference crop of the source photo: the row starts immediately after the
// rearmost door and ends three windows past the last pre-lit reference
// window, before the forward door. The two window-like shapes right next to
// each door (447/476 at the tail, 1916/1947 at the nose) are door framing,
// not real windows, and are excluded. Gaps bigger than one window's pitch
// elsewhere are the mid-cabin doors — there is no window painted there in
// the source photo, so none is placed there.
const WINDOW_X = [
  520, 541, 560, 577, 596, 615, 631, 650, 667, 689, 710, 728, 746, 761, 778, 796, 813, 835.5, 857,
  892, 916, 945, 967.5, 989, 1007, 1023, 1040, 1056, 1075, 1094, 1112, 1135.5, 1156, 1175, 1194,
  1214, 1233, 1264, 1280, 1299, 1321, 1343, 1361, 1380, 1398, 1417, 1444, 1469, 1510.5, 1533, 1550,
  1572, 1594, 1615, 1634, 1653, 1675, 1697, 1715, 1733, 1751, 1769, 1788, 1806, 1829.5, 1852, 1872,
  1892,
];

// Linear fit (y = ROW_SLOPE * x + ROW_INTERCEPT) through the row's real
// measured y-centres.
const ROW_SLOPE = 0.004769371727855361;
const ROW_INTERCEPT = 360.3889212767812;

function windowPosition(x) {
  const y = ROW_SLOPE * x + ROW_INTERCEPT;
  return { left: (x / IMAGE_W) * 100, top: (y / IMAGE_H) * 100 };
}

export function AircraftWindowsExplorer({ projects }) {
  const chronological = [...projects].sort((a, b) => new Date(a.date) - new Date(b.date));
  const count = chronological.length;
  const slotCount = Math.max(WINDOW_X.length, count);

  const litWindows = chronological.map((project, i) => {
    // Spread projects evenly across the full row of real windows, oldest
    // at the tail (index 0) to newest at the nose (last index).
    const spread = count === 1 ? 0.5 : i / (count - 1);
    const slotIndex = Math.round(spread * (slotCount - 1));
    const x = WINDOW_X[Math.min(slotIndex, WINDOW_X.length - 1)];
    return { project, ...windowPosition(x) };
  });

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <div className="relative w-full bg-[#0b0c10]" style={{ aspectRatio: `${IMAGE_W} / ${IMAGE_H}` }}>
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/aircraft/a350-lights-off.webp"
            alt="Airbus A350 model, unpainted, parked in a hangar"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>

        {litWindows.map(({ project, left, top }, i) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            aria-label={`Open project: ${project.title}`}
            className="group absolute z-10 block -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{ left: `${left}%`, top: `${top}%`, width: '1.6%', height: '5.5%' }}
          >
            {/* hit area is generous for touch/mouse; the visible glow inside it is sized to the real
                window (~0.4% x 1.9% of the photo) so it reads as a lit window, not a painted-on block */}
            <span
              className="absolute inset-0 m-auto block h-[38%] w-[30%] rounded-full animate-window-pulse transition-transform duration-200 group-hover:scale-125"
              style={{
                animationDelay: `${(i % 9) * 0.35}s`,
                background:
                  'radial-gradient(circle at 50% 42%, #fffaf0 0%, #ffe6b0 40%, #ffc773 68%, #f0a955 100%)',
                boxShadow: '0 0 2px 0.5px rgba(255,205,130,0.6), 0 0 5px 1.5px rgba(255,180,90,0.4)',
              }}
            />

            <span
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-6 -translate-x-1/2 whitespace-nowrap rounded-[6px] border border-white/25 bg-black/85 px-5 py-2 font-mono text-[20px] uppercase tracking-[0.1em] text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {project.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
