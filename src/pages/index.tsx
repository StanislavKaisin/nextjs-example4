import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import getMakes, { Make } from "../components/database/getMakes";

interface HomeProps {
  makes: Make[];
}

export default function Home({ makes }: HomeProps) {
  return (
    <div className={styles.container}>
      <pre>{JSON.stringify(makes, null, 20)}</pre>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const makes = await getMakes();
  return { props: { makes } };
};
