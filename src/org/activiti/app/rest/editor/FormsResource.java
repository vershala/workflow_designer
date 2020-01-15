/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.activiti.app.rest.editor;

import javax.servlet.http.HttpServletRequest;

import org.activiti.app.domain.editor.AbstractModel;
import org.activiti.app.model.common.ResultListDataRepresentation;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 去除重复代码，与/rest/models方法整合。
 * 使用getModels方法为了以租户形式展示下属表单
 * @author AsyDong
 * @time 2019-3-5 9:56
 * @version 2.0
 */
@RestController
@RequestMapping("/rest/form-models")
public class FormsResource extends AbstractModelsResource{

  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResultListDataRepresentation getForms(HttpServletRequest request) {

    return super.getModels("", "modifiedDesc", AbstractModel.MODEL_TYPE_FORM, request);
  }

}
