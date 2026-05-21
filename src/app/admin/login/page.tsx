export const metadata = {
  title: "Admin Login | Builder Deals Intel"
};

export default function AdminLoginPage() {
  return (
    <div className="page">
      <section className="page-title">
        <h1>Admin login.</h1>
        <p>Use the `ADMIN_SECRET` configured in the deployment environment.</p>
      </section>
      <form action="/api/admin/login" className="panel form-grid" method="post">
        <div className="field">
          <label htmlFor="secret">Admin secret</label>
          <input id="secret" name="secret" required type="password" />
        </div>
        <button className="button" type="submit">
          Enter review queue
        </button>
      </form>
    </div>
  );
}
