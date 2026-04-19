import type { Category, CipherDef, CipherId } from '@/types';

interface SidebarProps {
  ciphers: ReadonlyArray<CipherDef>;
  categories: ReadonlyArray<Category>;
  selected: CipherId;
  onSelect: (id: CipherId) => void;
}

export default function Sidebar({
  ciphers,
  categories,
  selected,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Cipher operations">
      <div className="sidebar-header">Operations</div>

      {categories.map((cat) => (
        <div key={cat} className="category-group">
          <div className="category-label" aria-hidden="true">
            {cat}
          </div>

          {ciphers
            .filter((c) => c.category === cat)
            .map((c) => (
              <button
                key={c.id}
                className={`cipher-btn${selected === c.id ? ' is-active' : ''}`}
                onClick={() => onSelect(c.id)}
                aria-current={selected === c.id ? 'page' : undefined}
                title={c.description}
              >
                {c.label}
              </button>
            ))}
        </div>
      ))}
    </aside>
  );
}
