const submit = async () => {
  const text = document.getElementById('input').value;
  const groupName = document.getElementById('groupName').innerHTML;

  const response = await fetch(`/group/${groupName}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  console.log(response);
};
