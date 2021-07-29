import React, { useState,useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Calculator from "../../components/Calculator/Calculator";
import "./product.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { Link } from "react-router-dom";
import { VscClose } from "react-icons/vsc";
// import Pagination from "react-js-pagination";

const Product = (props) => {
  const [selectedProduct, setselectedProduct] = useState([]);
  const [catItem, setCatItem] = useState("");
  const [order, setOrder] = useState([]);
  const [prodOrder, setProdOrder] = useState([]);
  const [prodOrderPrice, setProdOrderPrice] = useState([]);
  const [clientName, setName] = useState("");
  const [clientphoneNumber, setPhoneNumber] = useState("");
  const [openModalClass, setOpenModalClass] = useState("modalSectionHidden");
  const [successModal, setSuccessModal] = useState("forHidden");
  const orderPriceSplite = Number(prodOrderPrice).toLocaleString();
  const [filteredData, setFilteredData] = useState();
  const [wordEntered, setWordEntered] = useState("");
  const [notFound, setNotFound] = useState();

  // const [activePage, setActivePage] = useState(1);
  // selection products
  let selectedProdcutByCat = [];
  if (catItem) {
    for (let i = 0; i < props.product.length; i++) {
      if (props.product[i].category_name === catItem) {
        selectedProdcutByCat[i] = props.product[i];
      }
    }
  } else {
    selectedProdcutByCat = props.product;
  }

  // const [resultProduct, setResultProduct] = useState(selectedProdcutByCat);
  // //Pagination
  // const handlePageChange = (pageNumber) => {
  //   console.log(`active page is ${pageNumber}`);
  //   setActivePage(pageNumber);
  // };
  // let paginationProduct = [];
  // const perPageProduct = 5;

  // const fetchProducts = () => {
  //   for (
  //     let k = activePage * perPageProduct - perPageProduct;
  //     k < activePage * perPageProduct;
  //     k++
  //   ) {
  //     paginationProduct[k] = selectedProdcutByCat[k];
  //   }
  //   setResultProduct(paginationProduct);
  // };
  // useEffect(() => {
  //   fetchProducts();
  // },[activePage]);

  /// filter brands
  var chat_ID = "-1001247339615";
  for (let i = 0; i < props.brands.length; i++) {
    if (selectedProduct.brand_name === props.brands[i].link) {
      chat_ID = props.brands[i].telegram_chat_id || "-1001247339615";
    }
  }
  /// send telegram group
  const onSubmitModal = (e) => {
    e.preventDefault();
    let api = new XMLHttpRequest();
    var forSend = `🏪 Магазин: ${prodOrder}%0A💵 Наличными%0A%0A👥Имя: ${clientName}%0A📞Тел: ${clientphoneNumber}%0A📦Товар: ${order}%0A💵Итого: ${orderPriceSplite} сум`;
    var token = "1745885286:AAGnCac1rJJnQI2XIAUW8LL2_RN2MHN-SVE";
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_ID}&text=${forSend}`;
    api.open("GET", url, true);
    api.send();
    setName("");
    setPhoneNumber("");
    setSuccessModal("modalSuccessSubmit");
    setOpenModalClass("forHidden");
  };
  //search
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const searchResult = selectedProdcutByCat.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (event === "") {
      setFilteredData([]);
    } else {
      setFilteredData(searchResult);
    }
    if (searchResult.length === 0) {
      setNotFound(<h5 style={{textAlign:"center"}}>Ничего не найдено :(</h5>);
    }
  };
  useEffect(() => {
    setNotFound()
  }, [wordEntered])

  return (
    <>
      <Calculator
        brands={props.brands}
        CalcProductDB={props.product}
        selectedProduct={selectedProduct}
      />
      <Container>
        <Row>
          <Col>
            <div className="kategoriy">Категории</div>
          </Col>
        </Row>
        <Row>
          {props.category.map((categories, i) => {
            return (
              <Col key={i} lg="2" md="3" sm="3" xs="3">
                <div className="catBox">
                  <a href="#products">
                    <div
                      className="imgBoxCat"
                      onClick={() => setCatItem(categories.link)}
                    >
                      <div className="circle"></div>
                      <img
                        src={
                          "https://admin.sportmix.uz/uploads/" +
                          categories.image
                        }
                        alt=""
                      />
                    </div>
                  </a>
                  <div className="CatText">{categories.name}</div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
      <div className="productComponent">
        <Container>
          <Row>
            <Col>
              <div className="searchContainer">
                <input
                  className="form-control searchInput"
                  type="text"
                  placeholder="Поиск товаров..."
                  value={wordEntered}
                  onChange={handleFilter}
                />
              </div>
              <br />
            </Col>
          </Row>
          <Row id="products">
            {notFound
              ? notFound
              : (filteredData ? filteredData : selectedProdcutByCat).map(
                  (product, i) => (
                    <Col
                      lg="3"
                      md="4"
                      xs="6"
                      key={i}
                      onClick={() => setselectedProduct(product)}
                    >
                      <div className="procuctCard">
                        <div className="imgBox">
                          <img
                            src={
                              "https://admin.sportmix.uz/uploads/" +
                              product.image
                            }
                            alt=""
                          />
                          <div className="moreInfo">
                            <Link to={`/product/${product.id}`}>подробные</Link>
                          </div>
                        </div>
                        <div className="productTexts">
                          <h2 className="productName">{product.name}</h2>
                          <div className="priceAndbutton">
                            <p className="productPrice">
                              {Number(product.price).toLocaleString()} сум
                            </p>
                            <div className="bottomButtons">
                              <div
                                className="orderr"
                                onClick={() => {
                                  setOpenModalClass("modalSection");
                                }}
                              >
                                <Button
                                  variant="outline-dark"
                                  className="buttonkupitVrasrochka"
                                  onClick={() => {
                                    setOrder(product.name);
                                    setProdOrder(product.brand_name);
                                    setProdOrderPrice(product.price);
                                  }}
                                >
                                  Заказать
                                </Button>
                              </div>
                              <Button
                                variant="outline-dark"
                                className="buttonkupitVrasrochka rassrochka"
                                href="#calcBox"
                              >
                                Рассрочку
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  )
                )}
          </Row>
          <Row>
            {/* <Pagination
              activePage={activePage}
              itemsCountPerPage={perPageProduct}
              totalItemsCount={450}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            /> */}
          </Row>
          <Row>
            <div className={openModalClass}>
              <form className="mainModalContainer" onSubmit={onSubmitModal}>
                <div
                  className="closeBtn"
                  onClick={() => setOpenModalClass("forHidden")}
                >
                  <VscClose />
                </div>
                <div className="inputFormBox">
                  <label htmlFor="">
                    <b>Товар:</b> {order}
                  </label>
                  <input
                    type="text"
                    className="textsModalForm"
                    placeholder="Имя"
                    onChange={(e) => setName(e.target.value)}
                    value={clientName}
                  />
                  <input
                    type="text"
                    className="textsModalForm"
                    placeholder="Номер телефона"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={clientphoneNumber}
                  />
                  <input
                    type="hidden"
                    className="textsModalForm"
                    placeholder="product"
                    value={order}
                  />
                  <button type="submit" className="buttonModal">
                    Отправить
                  </button>
                </div>
              </form>
            </div>
            <div className={successModal}>
              <div id="success-icon">
                <div></div>
              </div>
              <svg
                id="close-modal"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 10 10"
                onClick={() => setSuccessModal("forHidden")}
              >
                <line x1="1" y1="-1" x2="9" y2="11" strokeWidth="2.5" />
                <line x1="9" y1="-1" x2="1" y2="11" strokeWidth="2.5" />
              </svg>
              <h3>
                <strong>Ваша заявка успешно отправлена</strong>
              </h3>
            </div>
          </Row>
        </Container>

        <Container>
          <Row>
            <div className="brands">
              <div className="mt-4"></div>
              <h2 className="magazine">Магазины</h2>
              <div className="mb-4"></div>
              <Swiper
                className="mySwiper"
                breakpoints={{
                  320: {
                    slidesPerView: 3.5,
                  },
                  480: {
                    slidesPerView: 4.5,
                  },
                }}
              >
                {props.brands.map((brands, i) => {
                  return (
                    <SwiperSlide className="brand" key={i}>
                      <Link
                        to={`/${brands.link}`}
                        className="brandImage"
                        onClick={() => setCatItem(brands.link)}
                      >
                        <div className="circle"></div>
                        <img
                          src={
                            "https://admin.sportmix.uz/uploads/" + brands.image
                          }
                          alt=""
                        />
                      </Link>
                      <div className="brandsText">{brands.name}</div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Product;