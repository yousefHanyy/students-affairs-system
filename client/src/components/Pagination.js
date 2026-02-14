// Pagination Component for handling page navigation in data tables.
class Pagination {
  constructor(
    paginationInfoId = "#pagination-info",
    paginationNavId = "#pagination",
  ) {
    this.paginationInfoElm = document.querySelector(paginationInfoId);
    this.paginationNavElm = document.querySelector(paginationNavId);
    this.onPageChange = null;
    this.currentPage = 1;
    this.totalPages = 1;
  }
  render(currentPage, totalPages, totalItems, pageSize) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    //On the last page, there might be fewer items than current x pageSize, that why we use math.min:
    const end = Math.min(currentPage * pageSize, totalItems);
    this.paginationInfoElm.textContent = `Showing ${start}–${end} of ${totalItems}`;

    this.paginationNavElm.innerHTML = "";

    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<button class="page-link">Previous</button>`;
    prevLi.addEventListener("click", () => {
      if (currentPage > 1 && this.onPageChange)
        this.onPageChange(currentPage - 1);
    });
    this.paginationNavElm.appendChild(prevLi);

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${end === totalItems ? "disabled" : ""}`;
    nextLi.innerHTML = `<button class="page-link">Next</button>`;
    nextLi.addEventListener("click", () => {
      if (currentPage < totalPages && this.onPageChange)
        this.onPageChange(currentPage + 1);
    });
    this.paginationNavElm.appendChild(nextLi);
  }
}
export default Pagination;
