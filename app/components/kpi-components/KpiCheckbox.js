"use client";

function KpiCheckbox({ kpi, checked, onChange }) {
    return (
      <div>
        <input
          type="checkbox"
          id={kpi}
          name={kpi}
          checked={checked}
          onChange={() => onChange(kpi)}
        />
        <label htmlFor={kpi}>{kpi}</label>
      </div>
    );
  }
  