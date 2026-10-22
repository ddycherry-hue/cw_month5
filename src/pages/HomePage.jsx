
import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div style={{ maxWidth: 1000, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <Title>GEeks Shop</Title>
      <Paragraph>Каталог товаров, фильтры, избранное и корзина.</Paragraph>
      <Button type="primary" size="large"><Link to="/products">Открыть каталог</Link></Button>
    </div>
  )
}

export default HomePage
