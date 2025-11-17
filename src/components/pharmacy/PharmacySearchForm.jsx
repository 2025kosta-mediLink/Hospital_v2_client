/**
 * 필터 바 컴포넌트
 * 약국 검색 필터를 표시
 */

function PharmacySearchForm({ sortBy, filterOpen, onSortChange, onFilterChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-dropdown" onClick={() => onSortChange && onSortChange()}>
        추천순 ∨
      </div>
      <div className="filter-tag-dropdown">거리순</div>
      <div 
        className={`filter-tag ${filterOpen ? 'active' : ''}`}
        onClick={() => onFilterChange && onFilterChange(!filterOpen)}
      >
        영업중
      </div>
    </div>
  );
}

export default PharmacySearchForm;

