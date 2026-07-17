const mockCategories = [
  {
    id: "CAT-001",
    name: "Quimica",
    area: "Bioquimica",
    controls: 18,
    status: "Activa",
    updatedAt: "08 Jul 2026",
  },
  {
    id: "CAT-002",
    name: "Hematologia",
    area: "Laboratorio",
    controls: 12,
    status: "Activa",
    updatedAt: "07 Jul 2026",
  },
  {
    id: "CAT-003",
    name: "Hormonas",
    area: "Inmunoanalisis",
    controls: 9,
    status: "Revision",
    updatedAt: "05 Jul 2026",
  },
  {
    id: "CAT-004",
    name: "Microbiologia",
    area: "Cultivos",
    controls: 7,
    status: "Activa",
    updatedAt: "02 Jul 2026",
  },
];

export default function CategoriasPage() {
  return (
    <section className="workspace">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Administracion</p>
          <h1>Categorias</h1>
        </div>
        <button className="primaryButton" type="button">
          Ingresar nuevo
        </button>
      </div>

      <div className="toolbar" aria-label="Filtros de categorias">
        <label className="field">
          <span>Buscar por nombre</span>
          <input type="search" placeholder="Ej. Quimica" />
        </label>
        <label className="field">
          <span>Area</span>
          <select defaultValue="">
            <option value="">Todas las areas</option>
            <option>Bioquimica</option>
            <option>Laboratorio</option>
            <option>Inmunoanalisis</option>
            <option>Cultivos</option>
          </select>
        </label>
      </div>

      <div className="tablePanel">
        <table>
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Categoria</th>
              <th>Area</th>
              <th>Controles</th>
              <th>Estado</th>
              <th>Actualizacion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  <strong>{category.name}</strong>
                </td>
                <td>{category.area}</td>
                <td>{category.controls}</td>
                <td>
                  <span
                    className={
                      category.status === "Activa" ? "statusActive" : "statusReview"
                    }
                  >
                    {category.status}
                  </span>
                </td>
                <td>{category.updatedAt}</td>
                <td>
                  <button className="ghostButton" type="button">
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
