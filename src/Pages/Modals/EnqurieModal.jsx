const EnquireModal = ({ status }) => {
  return (
    <>
      <p>Hi!</p>
      <br />
      {status === "Unresolved" ? (
        <p>
          If this item belongs to you and its returned to the Lost and Found
          Centre, please head to the centre. Bring along proof of ownership
          where applicable. Thank you!
        </p>
      ) : (
        <p>
          This item has been resolved. If you have any enquiries regarding this
          item, please head on to the Lost and Found Centre or contact us.
        </p>
      )}
<br />
      <p>Lost and Found Center<br/>Insert Address Here<br/>#00-00, 000000 NTU</p>
      <br/>
      <p>6555 6555</p>
    </>
  );
};

export default EnquireModal;
