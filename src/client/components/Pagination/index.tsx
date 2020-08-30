import React, { Component } from "react";
import { Link } from "react-router-dom";

export interface PaginationProps {
  pagesCount: number,
  currentPageNumber: number,
  maxButtonsCount?: number,
  linkTemplate: (id: number) => string
}

export const MAX_BUTTONS_COUNT = 10;

function getPagesButtons(currentPageNumber: number, pagesCount: number, maxButtonsCount: number, linkTemplate: (number: number) => string): any[] {
  let buttons: any[] = [];

  if (currentPageNumber <= maxButtonsCount && pagesCount <= maxButtonsCount) {
    pushLoop(1, pagesCount);
  }

  if (currentPageNumber <= maxButtonsCount && pagesCount > maxButtonsCount && currentPageNumber <= Math.floor(maxButtonsCount / 2)) {
    pushLoop(1, maxButtonsCount - 1);
    pushDeriver();
    pushOne(pagesCount);
  }

  if (pagesCount > maxButtonsCount && currentPageNumber > Math.floor(maxButtonsCount / 2) && currentPageNumber < pagesCount - Math.floor(maxButtonsCount / 2) + 1) {
    pushOne(1);
    pushDeriver();
    pushLoop(currentPageNumber - Math.floor(maxButtonsCount / 2) + 2, currentPageNumber + Math.floor(maxButtonsCount / 2) - 2);
    pushDeriver();
    pushOne(pagesCount);
  }

  if (pagesCount > maxButtonsCount && currentPageNumber > Math.floor(maxButtonsCount / 2) && currentPageNumber >= pagesCount - Math.floor(maxButtonsCount / 2) + 1) {
    pushOne(1);
    pushDeriver();
    pushLoop(pagesCount - Math.floor(maxButtonsCount / 2) - 2, pagesCount);
  }

  function pushDeriver() {
    buttons.push(<span className="pagination-deriver">...</span>);
  }

  function pushOne(pageNumber: number) {
    buttons.push(
      <div className={`pagination-link-${pageNumber}${currentPageNumber == pageNumber + 1 ? " current-page-link" : ""}`}>
        <Link to={linkTemplate(pageNumber)}>{pageNumber}</Link>
      </div>
    );
  }

  function pushLoop(from: number, to: number) {
    for (let i = from; i <= to; i++) {
      pushOne(i);
    }
  }

  return buttons;
}

export default class Pagination extends Component<PaginationProps, any> {
  render() {
    return (
      <section className="pagination">
        {
          ...getPagesButtons(
            this.props.currentPageNumber,
            this.props.pagesCount,
            this.props.maxButtonsCount || MAX_BUTTONS_COUNT,
            this.props.linkTemplate
          )
        }
      </section>
    );
  }
}
