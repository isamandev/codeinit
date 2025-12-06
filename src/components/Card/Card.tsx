function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white  w-full">{children}</div>
  );
}

export default Card;
