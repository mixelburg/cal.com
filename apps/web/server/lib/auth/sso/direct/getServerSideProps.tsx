
export async function getServerSideProps() {
  return {
    props: {
      samlTenantID,
      samlProductID,
    },
  };
}
