import Link from "next/link";

export default function Home() {
  return (
    <div>Landing page
      <Link href="/auth/signin">
       <button> Login </button>
      </Link>
      <Link href="/auth/signup">
       <button> Sign Up </button>
      </Link>

      <br />
      <form action="/api/extract-content" method="POST" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload PDF</button>
      </form>

    </div>
  );
}
