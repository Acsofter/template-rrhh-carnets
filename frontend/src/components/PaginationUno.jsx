import userServices from "../services/user.service";
import axios from "axios";
import authHeader from "../services/auth-header";
import { Link } from "react-router-dom";

export const PaginationUno = ({
  totalPagesToShow,
  previous,
  next,
  showRows,
  order,
  search,
  limit,
  totalPages,
  paginationIndexPage,
  current,
  setPaginationIndexPage,
}) => {
  const limitShow = 10;

  // Mostrar la lista siguiente de elementos paginados si hay
  const showMorePages = (e) => {
    e.stopPropagation();
    setPaginationIndexPage(paginationIndexPage + 1);
    showRows(
      userServices.getEmpleados(
        limit,
        paginationIndexPage * limitShow + limit,
        order,
        search
      )
    );
  };

  // Mostrar la lista anterior de elementos paginados si hay
  const showLessPages = (e) => {
    e.stopPropagation();
    setPaginationIndexPage(paginationIndexPage - 1);
    showRows(
      userServices.getEmpleados(
        limit,
        paginationIndexPage * limitShow - 10,
        order,
        search,
       
      )
    );
  };

  // Manejador de los clicks de los botones de la paginacion
  const paginationFunction = (page) => {
    const acts = {
      num: () =>
        showRows(
          userServices.getEmpleados(
            undefined,
            page.target.attributes.value.nodeValue,
            order,
            search,
           
          )
        ),
      next: () =>
        next !== null && showRows(axios.get(next, { headers: authHeader() })),
      previous: () =>
        previous !== null &&
        showRows(axios.get(previous, { headers: authHeader() })),
      saltar: () => {
        const newIndex = paginationIndexPage + 1;
        if (!(newIndex > totalPagesToShow)) {
          setPaginationIndexPage(newIndex);
        }
      },
      volver: () => {
        const newIndex = paginationIndexPage - 1;
        if (!(newIndex < 0)) {
          setPaginationIndexPage(newIndex);
        }
      },
    };

    const id_name = page.target.attributes.id.nodeValue;
    acts[id_name]();
  };

  return (
    <>
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {/* boton previus: de desabilita cuando la variable previous es null y cuando current es igual al primer elemento de la lista pasa a la lista anterior */}
          <li
            className={previous ? "page-item" : "page-item disabled"}
            id="next"
          >
            <Link
              id="previous"
              onClick={
                paginationIndexPage * limitShow !== current
                  ? paginationFunction
                  : showLessPages
              }
              className="page-link"
              href="#"
            >
              Atras
            </Link>
          </li>

          {
            /* boton volver ("..."): aparecera solo cuando el conjunto de paginas no sea el primero  */
            paginationIndexPage + 1 > 1 && (
              <li className="page-item" id="next">
                <Link
                  id="volver"
                  onClick={showLessPages}
                  className="page-link"
                  href="#"
                >
                  ...
                </Link>
              </li>
            )
          }

          {
            /* se genera la lista de paginas segun el limitShow proporcionado */
            Array.from(
              { length: limitShow },
              (_, j) => paginationIndexPage * limitShow + j
            ).map((num, index) => {
              // (num < totalPages) evita que se generen paginas en la lista de las totales
              return (
                num < totalPages && (
                  <li
                    className={
                      current == num ? "page-item active" : "page-item"
                    }
                    key={index}
                  >
                    <Link
                      id="num"
                      onClick={paginationFunction}
                      value={num}
                      className="page-link"
                      href="#"
                    >
                      {num + 1}
                    </Link>
                  </li>
                )
              );
            })
          }
          {
            // los botones que indican el total de paginas y mostrar mas paginas desapareceran cuando sea la unica o la ultima en la lista
            totalPagesToShow !== paginationIndexPage + 1 &&
              totalPagesToShow !== 0 && (
                <>
                  <li className="page-item">
                    <Link
                      className="page-link"
                      id="next"
                      onClick={showMorePages}
                    >
                      ...
                    </Link>
                  </li>

                  <li className="page-item">
                    <Link className="page-link disabled" id="totalPages">
                      {totalPages}
                    </Link>
                  </li>
                </>
              )
          }

          {/* boton siguiente: se deshabilitara cuando next sea null y cuando current sea la ultima en la lista pasara a la siguiente lista*/}
          <li className={next ? "page-item" : "page-item disabled"}>
            <Link
              className="page-link"
              id="next"
              onClick={
                (paginationIndexPage + 1) * limitShow !== current + 1
                  ? paginationFunction
                  : showMorePages
              }
            >
              Siguiente
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
