import classes from "./agent-creation-success.module.scss";

const AgentCreationSuccess = () => {
  return (
    <div className={classes.success}>
      <div className={classes.success_container}>
        <h1>Agent Successfully Created</h1>
        <p>You have successfully created an agent account with Storm Logistics. An admin needs to approve your request before you can access your dashboard.</p>
      </div>
    </div>
  )
}

export default AgentCreationSuccess;