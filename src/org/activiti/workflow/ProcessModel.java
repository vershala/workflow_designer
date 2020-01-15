package org.activiti.workflow;

import org.activiti.bpmn.model.UserTask;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author ：mmzs
 * @date ：Created in 2019/11/20 11:55
 * @description：流程模板
 * @modified By：
 * @version: V1.0$
 */
public class ProcessModel implements Serializable {
    String processId;
    String processCd;
    String processName;
    String processVersion;
    String processAuthor;
    List<UserTask> nodes;

    public String getProcessId() {
        return processId;
    }

    public void setProcessId(String processId) {
        this.processId = processId;
    }

    public String getProcessCd() {
        return processCd;
    }

    public void setProcessCd(String processCd) {
        this.processCd = processCd;
    }

    public String getProcessName() {
        return processName;
    }

    public void setProcessName(String processName) {
        this.processName = processName;
    }

    public String getProcessVersion() {
        return processVersion;
    }

    public void setProcessVersion(String processVersion) {
        this.processVersion = processVersion;
    }

    public String getProcessAuthor() {
        return processAuthor;
    }

    public void setProcessAuthor(String processAuthor) {
        this.processAuthor = processAuthor;
    }

    public List<UserTask> getUserTasks() {
        return nodes;
    }

    public void setUserTasks(List<UserTask> userTasks) {
        nodes = userTasks;
    }

    public void addUserTask(UserTask userTask) {
       if(nodes == null) {
           nodes = new ArrayList<>();
       }
        nodes.add(userTask);
    }
}
