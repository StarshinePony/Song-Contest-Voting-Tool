import styles from "./page.module.css";
import { NavBtn } from "@/client/components";

export default function Home() {
  return (
    <>
    <NavBtn route="musician_voting" text="Musicians"/>
    <NavBtn route="login" text="Countries"/>
    </>
  );
}
