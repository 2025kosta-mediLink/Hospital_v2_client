/**
 * 필터 바 컴포넌트
 * 약국 검색 필터를 표시
 */

function PharmacySearchForm({ sortBy, filterOpen, onSortChange, onFilterChange }) {
  return (
    <div className="filter-bar">
      <div 
        className={`filter-tag ${sortBy === 'recommended' ? 'active' : ''}`}
        onClick={() => onSortChange && onSortChange('recommended')}
      >
        추천순
      </div>
      <div 
        className={`filter-tag ${sortBy === 'distance' ? 'active' : ''}`}
        onClick={() => onSortChange && onSortChange('distance')}
      >
        거리순
      </div>
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

