// Pagination Component for handling page navigation in data tables.
class Pagination {
  constructor(
    paginationContainerId = "#pagination-container",
    paginationInfoId = "#pagination-info",
    paginationNavId = "#pagination",
  ) {
    this.paginationContainer = document.querySelector(paginationContainerId);
    this.paginationInfoElm = document.querySelector(paginationInfoId);
    this.paginationNavElm = document.querySelector(paginationNavId);
    this.onPageChange = null;
    this.currentPage = 1;
    this.totalPages = 1;
  }

  renderContainer() {
    const containerHTML = `
      <!-- Pagination row -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <small id="pagination-info" class="text-muted"></small>
        <nav>
          <ul id="pagination" class="pagination mb-0"></ul>
        </nav>
      </div>
    `;
    if (this.paginationContainer) {
      this.paginationContainer.innerHTML = containerHTML;
      this.paginationInfoElm = document.querySelector("#pagination-info");
      this.paginationNavElm = document.querySelector("#pagination");
    }
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
