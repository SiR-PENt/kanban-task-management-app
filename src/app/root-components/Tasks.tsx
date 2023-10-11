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
        tasks.map((task, index) => {
          const { title, subtasks } = task;
          const completedSubtasks = subtasks.filter((subtask) => subtask.isCompleted === true).length;
  
          return (
            <div key={index} className='dark:bg-dark-grey p-6 rounded-md mt-6'>
              <p>{title}</p>
              <p className="text-medium-grey text-xs">{`${completedSubtasks} of ${subtasks.length} subtasks`}</p>
            </div>
          );
        })
    );
  }
  