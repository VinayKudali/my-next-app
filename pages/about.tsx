import Link from "next/link";

export default function About() {
  return (
    <div>
      <nav className="flex gap-4 p-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <h1>About Page</h1>
      <p>This is the about page under the pages router.</p>
    </div>
  );
}