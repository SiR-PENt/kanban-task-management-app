interface ISubtask {
    isCompleted: boolean;
  }
  
interface ITask {
    title: string;
    subtasks: ISubtask[];
  }
  
interface ITasksProps {
    tasks: ITask[];
  }
  
  export default function Tasks({ tasks }: ITasksProps) {

    return (
    //   <div className="border">
        // {
        tasks.map((task, index) => {
          const { title, subtasks } = task;
          const completedSubtasks = subtasks.filter((subtask) => subtask.isCompleted === true).length;
  
          return (
            <div key={index} className='dark:bg-dark-grey'>
              <p>{title}</p>
              <p>{`${completedSubtasks} of ${subtasks.length} subtasks`}</p>
            </div>
          );
        })
        // }
    //   </div>
    );
  }
  