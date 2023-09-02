const CrossOriginPopup = () => {
  return (
    <div className="bg-white rounded shadow p-1">
      <img
        className="rounded w-200"
        src={`${import.meta.env.BASE_URL}gifs/operation-export.gif`}
        alt="跨源使用介绍"
      />
    </div>
  )
}

export default CrossOriginPopup
