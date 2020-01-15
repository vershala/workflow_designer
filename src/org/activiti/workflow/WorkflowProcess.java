package org.activiti.workflow;

import java.io.Serializable;

/**
 * @ProjectName: workflow
 * @ClassName: WorkflowProcess
 * @author ：wangss
 * @date ：Created in 2019/11/21 15:43
 * @description：流程信息
 * @modified By：
 * @version: V1.0$
 */

public class WorkflowProcess implements Serializable {
    private String pid;

    private String name;

    private String applyId;

    private String modelCd;

    private boolean isEnd;

    public boolean isEnd() {
        return isEnd;
    }

    public void setEnd(boolean end) {
        isEnd = end;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getApplyId() {
        return applyId;
    }

    public void setApplyId(String applyId) {
        this.applyId = applyId;
    }

    public String getModelCd() {
        return modelCd;
    }

    public void setModelCd(String modelCd) {
        this.modelCd = modelCd;
    }
}
