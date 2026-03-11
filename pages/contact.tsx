import Link from "next/link";

export default function Contact() {
  return (
    <div>
      <nav className="flex gap-4 p-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <h1>Contact Page</h1>
      <p>Get in touch with us.</p>
    </div>
  );
}