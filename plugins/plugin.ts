/**
 * Command interface
 */
interface Command {
     /**
      * The function to be executed for this command
      */
     function: () => void;
     /**
      * The pattern to match for this command
      */
     pattern: string;
     /**
      * Aliases for this command
      */
     alias: string[];
     /**
      * Whether to exclude this command from the command list
      */
     dontAddCommandList: boolean;
     /**
      * Description of the command
      */
     desc: string;
     /**
      * Whether this command can only be executed by the bot owner
      */
     fromMe: boolean;
     /**
      * The category of the command
      */
     category: string;
     /**
      * Usage instructions for the command
      */
     use: string;
     /**
      * The filename where this command is defined
      */
     filename: string;
   }
   
   /**
    * Array of commands
    */
   const commands: Command[] = [];
   
   /**
    * Adds a new command to the commands array
    * @param {Partial<Command>} commandObj - The command object
    * @param {() => void} handler - The function to handle the command
    * @returns {Command} The complete command object
    */
   function Index(commandObj: Partial<Command>, handler: () => void): Command {
     const command: Command = {
       ...commandObj,
       function: handler,
       pattern: commandObj.pattern || commandObj.cmdname || '',
       alias: commandObj.alias || [],
       dontAddCommandList: commandObj.dontAddCommandList || false,
       desc: commandObj.desc || commandObj.info || '',
       fromMe: commandObj.fromMe || false,
       category: commandObj.category || commandObj.type || 'misc',
       use: commandObj.use || '',
       filename: commandObj.filename || 'Not Provided',
     };
   
     command.info = command.desc;
     command.type = command.category;
   
     commands.push(command);
     return command;
   }
   export {
     Index,
     commands,
   };