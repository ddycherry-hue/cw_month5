import { Button, Card, Col, Empty, Row, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "../stores/favoritesStore";
import styles from "./ProductsPage.module.scss";

const { Title, Text } = Typography;

function FavoritesPage() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  return <div className={styles.page}>
    <div className={styles.intro}><Title level={1}>Избранное</Title><Text>Список сохраняется в этом браузере.</Text></div>
    {!favorites.length ? <Empty description="Пока нет избранных товаров"><Link to="/products">Перейти в каталог</Link></Empty> :
      <Row gutter={[16, 16]}>{favorites.map((product) => <Col key={product.id} xs={12} sm={8} md={6}>
        <Card hoverable cover={<Link to={`/products/${product.id}`}><img className={styles.productImage} src={product.images?.[0]} alt={product.title} /></Link>}>
          <Tag color="blue">{product.category?.name}</Tag>
          <Link to={`/products/${product.id}`} className={styles.productLink}><Title level={5}>{product.title}</Title></Link>
          <div className={styles.cardBottom}><Text strong>${Number(product.price).toFixed(2)}</Text><Button type="text" onClick={() => toggleFavorite(product)}>Убрать ♥</Button></div>
        </Card>
      </Col>)}</Row>}
    </div>;
}

export default FavoritesPage;
